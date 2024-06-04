import simpleGit from "simple-git";
import type { DBEnvironmentT } from "~/typings";
import { dbQuery, executeFile } from "~/utils/back";
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

    let query = await dbQuery<DBEnvironmentT>("SELECT deploy_path, path FROM environment WHERE ID=?", body.ID);
    if (query instanceof Error) {
        setResponseStatus(event, 500, "Errore nella query del DB");
        return
    }

    const { deploy_path, path }: DBEnvironmentT = query[0][0];

    if (deploy_path == null) {
        setResponseStatus(event, 500, "Deploy Path è null");
        return
    }
    if (body.force) {
        console.log(await simpleGit(path).clean(['f'])); // git clean -f
    } else if (await new GitBranch(path).hasUncommittedChanges()) {
        setResponseStatus(event, 500, "File senza commit trovati");
        return;
    }


    let execValue;
    try {
        execValue = await executeFile(deploy_path, [], { shell: true, cwd: path })
        console.log(execValue);
    } catch (e) {
        console.warn(e);
        setResponseStatus(event, 500, "Errore nell'esecuzione del file");
        return
    }
    setResponseStatus(event, 204, "OK");
    return execValue
});