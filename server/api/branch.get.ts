import mysql from 'mysql2'
import { TableRowT } from '~/typings'

export default defineEventHandler(async (event) => {
    try {
        // connects to the database
        const connection = mysql.createConnection(
            useRuntimeConfig().app.dbconfig
        )
        // Prende tutti gli elementi della tabella "branches"
        const response: TableRowT[] = (await connection.promise().query(`SELECT * FROM branches;`))[0] as TableRowT[];
        return response
    } catch (error) {
        console.error('Errore durante la visualizzazione delle branch:', error);
        return {
            status: 500,
            body: { error: 'Si è verificato un errore imprevisto durante la visualizzazione delel branch' },
        };
    }
})