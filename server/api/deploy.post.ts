import simpleGit from "simple-git";
import type { FileExecutionT } from "~/typings";
import { readJson, executeFile } from "~/utils/back";
import { GitBranch } from "~/utils/git";

export default defineEventHandler(async (event) => {
    let body: {
        ID: number,
        force?: boolean
    } = await readBody(event);
    if (!body || body.ID == undefined) {
        setResponseStatus(event, 500, "Assicurati di inserire il campo `ID`")
        return;
    }

    let data = readJson();
    data = data.filter((_, index) => index == body.ID);
    if (data.length === 0) {
        setResponseStatus(event, 500, "Campo `ID` non valido")
        return;
    }
    const { deploy_path, path } = data[0];

    if (body.force) {
        console.log(await simpleGit(path).clean(['f'])); // git clean -f
    } else if (await new GitBranch(path).hasUncommittedChanges()) {
        setResponseStatus(event, 299, "File senza commit trovati");
        return;
    }


    let execValue: FileExecutionT;
    try {
        execValue = await executeFile(deploy_path, [], { shell: true, cwd: path })
    } catch (e) {
        console.warn(e);
        setResponseStatus(event, 500, "Errore nell'esecuzione del file");
        return
    }
    setResponseStatus(event, 200, "OK");
    console.log(execValue);
    return execValue.stdout
});