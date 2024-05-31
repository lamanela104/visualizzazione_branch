import mysql from 'mysql2'
import { EnvironmentT } from '~/typings'
import { dbQuery, isValidPath } from '~/utils/back';

export default defineEventHandler(async (event) => {

    // Legge il valore del body
    const body: EnvironmentT = await readBody(event);

    if (body.environment == undefined) {
        setResponseStatus(event, 500, 'Assicurati di fornire il campo `environment`')
        return
    }
    body.path ||= "."; // se body.branch è vuoto (anche "") diventa "MASTER" 

    const status = await isValidPath(body.path)
    if(typeof status == "string"){
        setResponseStatus(event, 500, status)
        return
    }

    // connects to the database
    const query = await dbQuery(
        `UPDATE environment SET path=? WHERE environment = ? `,
        [body.path, body.environment]
    )
    if(query instanceof Error){
        setResponseStatus(event, 500, 'Si è verificato un errore imprevisto durante la modifica delle branch')
        return;
    }
    setResponseStatus(event, 201, 'OK')
})