import { FieldT } from '~/typings';
import { readJson } from '~/utils/back';
import { GitBranch } from '~/utils/git';

export default defineEventHandler(async (event) => {

    // Legge il valore del body
    const body = await readBody(event) as FieldT;

    if (!body || body.ID == undefined) {
        setResponseStatus(event, 500, 'Assicurati di fornire il campo `ID`')
        return
    }
    // se body.branch è vuoto (anche "") diventa "MASTER"
    body.branch ||= "master"

    // Prende il dato con ID = body.ID
    let data = readJson().filter((_, i) => i == body.ID);
    if (data.length === 0) {
        setResponseStatus(event, 500, 'Campo `ID` non valido');
        return;
    }

    // checkouts the branch
    let { path } = data[0];
    let gb = new GitBranch(path);
    await gb.changeBranch(body.branch)

    setResponseStatus(event, 204, 'OK')
})