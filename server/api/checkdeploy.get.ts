import simpleGit from "simple-git";
import type { FieldT } from "~/typings";
import { readJson, GitBranch } from "~/utils";

export default defineEventHandler(async (event) => {
    // Reads the body of the request
    let body = getQuery(event) as FieldT & { force?: boolean };
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
    const { path } = data[0];
    if (body.force) {
        console.log(await simpleGit(path).clean(['f'])); // git clean -f
    } else if (await new GitBranch(path).hasUncommittedChanges()) {
        setResponseStatus(event, 299, "File senza commit trovati");
        return;
    }

    setResponseStatus(event, 204, "OK");
})