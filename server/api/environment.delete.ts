import mysql from 'mysql2'
import { TableRowT } from '~/typings'

export default defineEventHandler(async (event) => {
    try {
        // connects to the database
        const connection = mysql.createConnection(
            useRuntimeConfig().dbconfig
        )

        // Legge il valore del body
        const body = getQuery(event);
        if (body.environment == undefined) {
            setResponseStatus(event, 500, 'Assicurati di fornire il campo `environment`')
            return
        }

        // Cancella il valore
        const response = (await connection.promise()
            .query(
                `DELETE FROM environment WHERE environment = ? `,
                [body.environment]
            ))[0]
        setResponseStatus(event, 201, "OK")
    } catch (error) {
        console.error('Errore durante l\'eliminazione delle branch:', error);
        setResponseStatus(event, 500, 'Si è verificato un errore imprevisto durante l\'eliminazione delle branch')

    }
})