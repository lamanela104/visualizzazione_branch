import mysql from 'mysql2'
import { TableRowT } from '~/typings'

export default defineEventHandler(async (event) => {
    try {
        // connects to the database
        const connection = mysql.createConnection(
            useRuntimeConfig().app.dbconfig
        )

        // Legge il valore del body
        const body = getQuery(event);
        if (body.environment == undefined) {
            return {
                status: 500,
                body: "Assicurati di fornire il campo `environment`"
            }
        }

        // Cancella il valore
        const response = (await connection.promise()
            .query(
                `DELETE FROM branches WHERE environment = ? `,
                [body.environment]
            ))[0]

        return {
            status: 200
        }
    } catch (error) {
        console.error('Errore durante la visualizzazione delle branch:', error);
        return {
            status: 500,
            body: { error: 'Si è verificato un errore imprevisto durante la visualizzazione delel branch' },
        };
    }
})