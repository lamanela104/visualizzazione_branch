/**
 * The execution of the file output
 */
export interface FileExecutionT {
    stdout: string,
    stderr: string
}

export type SpawnedValue =
    | OnError
    | OnStdError
    | OnStdOut
    | OnClose
    | OnSpawn


interface OnError {
    event: "error",
    body: Error
}
interface OnStdError {
    event: "stderr",
    body: string
}
interface OnStdOut {
    event: "stdout",
    body: string
}
interface OnClose {
    event: "close",
    body: number
}
interface OnSpawn {
    event: "spawn"
}