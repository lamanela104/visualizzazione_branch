import { EnvironmentT } from '~/typings'
import { dbQuery, isValidPath } from '~/utils/back';
import GitBranch from '~/utils/gitutils';

export default defineEventHandler(async (event) => {

    // Legge il valore del body
    const body: {
        id: number
        environment: string
        branch: string
    } = await readBody(event);

    if (!body || body.id == undefined) {
        setResponseStatus(event, 500, 'Assicurati di fornire il campo `id`')
        return
    }

    body.branch ||= "master" // se body.branch è vuoto (anche "") diventa "MASTER" 
    // connects to the database
    let query = await dbQuery<{ path: string }[]>(
        `SELECT path FROM environment WHERE id=?`,
        [body.id]
    )
    if (query instanceof Error) {
        setResponseStatus(event, 500, 'Si è verificato un errore imprevisto durante la modifica delle branch')
        return;
    }
    let { path } = query[0][0] as { path: string };
    console.log(path)
    let gb = new GitBranch(path);
    console.log(
        await gb.changeBranch(body.branch)
    );
    // query = await dbQuery(
    //     `UPDATE environment SET path=? WHERE environment = ? `,
    //     [body.path, body.environment]
    // )
    // if (query instanceof Error) {
    //     setResponseStatus(event, 500, 'Si è verificato un errore imprevisto durante la modifica delle branch')
    //     return;
    // }
    setResponseStatus(event, 201, 'OK')
})