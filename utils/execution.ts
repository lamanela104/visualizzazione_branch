import { execFile, spawn } from 'child_process'
import type { ExecFileOptions, ChildProcess, Serializable, SpawnOptions } from 'child_process'
import type { ObjectEncodingOptions, } from 'fs'
import type { FileExecutionT, SpawnedValue } from 'typings';
export async function executeFile(path: string, args?: string[], options?: (ObjectEncodingOptions & ExecFileOptions)): Promise<FileExecutionT> {
    return await new Promise<FileExecutionT>((resolve, reject) => {
        execFile(path, args, options, (error, stdout, stderr) => {
            if (error)
                reject(error);
            else
                resolve({
                    stdout: stdout.toString('utf-8'),
                    stderr: stderr.toString('utf-8'),
                })
        });
    })
}

export class Spawner {
    private path: string
    private options: SpawnOptions

    private execution: ChildProcess = null as any

    constructor(path: string, options?: SpawnOptions) {
        this.path = path;
        this.options = options ?? {}
    }

    public async* spawn(): AsyncGenerator<SpawnedValue, void, undefined> {
        this.execution = spawn(this.path, [], this.options);
        this.execution.stdin?.setDefaultEncoding('utf-8')

        let fetchValues: SpawnedValue[] = []
        let continueCycle = true
        const push = (value: SpawnedValue) => {
            fetchValues.push(value);
        }
        const stop = () => {
            continueCycle = false;
        }

        // `push()` will act as `yield`
        this.setHandlers(push, stop);
        while (continueCycle) {
            if (fetchValues.length > 0)
                yield fetchValues.shift() as SpawnedValue
            else await new Promise(r => setImmediate(r))
        }
        yield {
            event: "close",
            body: 0
        }
    }
    private setHandlers(push: (v: SpawnedValue) => void, stop: () => void): void {
        this.execution.on("error", (err) => {
            push({
                event: 'error',
                body: err
            })
        }).on("spawn", () => {
            push({ event: 'spawn' })
        }).on("close", (code: number) => {
            push({
                event: 'close',
                body: code
            })
            stop();
        })

        this.execution.stderr?.on("data", (data: Buffer) => {
            push({
                event: 'stderr',
                body: data.toString('utf-8')
            })
        });
        this.execution.stdout?.on("data", (data: Buffer) => {
            push({
                event: 'stdout',
                body: data.toString('utf-8')
            })
        });
    }

    public write(data: Serializable): boolean | undefined {
        return this.execution.stdin?.write(data)
    }

    public kill(): boolean {
        return this.execution.kill();
    }
}