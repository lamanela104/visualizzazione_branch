import simpleGit from "simple-git";
import type { FieldT, FileExecutionT } from "~/typings";
import { readJson, executeFile, GitBranch } from "~/utils";

export default defineEventHandler(async (event) => {
    // Reads the body of the request
    let body = await readBody(event) as FieldT & { force?: boolean };
    if (!body || body.ID == undefined) {
        setResponseStatus(event, 500, "Assicurati di inserire il campo `ID`")
        return;
    }
    
    // Reads the json data of the request, filtering the odd one of
    let data = readJson();
    data = data.filter((_, index) => index == body.ID);
    if (data.length === 0) {
        setResponseStatus(event, 500, "Campo `ID` non valido")
        return;
    }

    //Check if repo has uncommitteed changes, or if it has .force param = true
    const { deploy_path, path } = data[0];
    if (body.force) {
        console.log(await simpleGit(path).clean(['f'])); // git clean -f
    } else if (await new GitBranch(path).hasUncommittedChanges()) {
        setResponseStatus(event, 299, "File senza commit trovati");
        return;
    }

    // Executes the deploy file
    let execValue: FileExecutionT;
    try {
        execValue = await executeFile(deploy_path, [], { shell: true, cwd: path })
    } catch (e) {
        console.warn(e);
        setResponseStatus(event, 500, "Errore nell'esecuzione del file");
        return
    }

    setResponseStatus(event, 200, "OK");
    return execValue
});