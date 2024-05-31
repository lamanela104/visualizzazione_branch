import mysql from 'mysql2'
import { dbQuery } from '~/utils/back';

export default defineEventHandler(async (event) => {

    // Legge il valore del body
    const { environment }: { environment: string } = getQuery(event);
    if (environment == undefined) {
        setResponseStatus(event, 500, 'Assicurati di fornire il campo `environment`')
        return
    }

    const result = await dbQuery(
        `DELETE FROM environment WHERE environment = ? `,
        [environment])
    if (result instanceof Error) {
        setResponseStatus(event, 500, result.message)
        return
    }
    setResponseStatus(event, 201, "OK")
})