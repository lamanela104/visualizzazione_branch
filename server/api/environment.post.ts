import { EnvironmentT } from '~/typings'
import { dbQuery, isValidPath } from '~/utils/back'
export default defineEventHandler(async (event) => {

    // Legge il valore del body
    const body: EnvironmentT = await readBody(event);
    if (!body.environment) { // '' o undefined...
        setResponseStatus(event, 500, 'Assicurati di fornire il campo `environment`')
        return
    }
    body.path ||= "./"; // se body.path è vuoto (anche "") diventa "./" 
    body.path = body.path.trim();

    // se il percorso non è valido 
    const status = await isValidPath(body.path)
    if (typeof status == "string") {
        setResponseStatus(event, 500, status)
        return;
    }

    //esegue comando
    const result = await dbQuery(`INSERT INTO environment (environment, path) VALUES (?,?)`, [body.environment, body.path])
    if (result instanceof Error) {
        setResponseStatus(event, 500, result.message)
        return;
    }
    setResponseStatus(event, 204, "OK")
})