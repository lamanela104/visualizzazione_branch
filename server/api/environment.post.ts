import mysql from 'mysql2'
import { EnvironmentT, TableRowT } from '~/typings'

export default defineEventHandler(async (event) => {
    try {
        // connects to the database
        const connection = mysql.createConnection(
            useRuntimeConfig().dbconfig
        )

        // Legge il valore del body
        const body: EnvironmentT = await readBody(event);
        if(body.environment == undefined){
            setResponseStatus(event, 500, 'Assicurati di fornire il campo `environment`')
            return
        }
        body.path ||= "."; // se body.branch è vuoto (anche "") diventa "MASTER" 
        
        // Inserisce il valore
        const response = (await connection.promise()
            .query(
                `INSERT INTO environment VALUES(?, ?)`,
                [body.environment, body.path]
        ))[0]
        setResponseStatus(event, 200, 'OK')
    } catch (error) {
        console.error("Errore durante l'aggiunta delle branch:", error);
        setResponseStatus(event, 500, 'Si è verificato un errore imprevisto durante l\'aggiunta delle branch')

    }
})