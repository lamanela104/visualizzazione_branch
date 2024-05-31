import { existsSync } from 'fs'
import simpleGit from 'simple-git';
import mysql from 'mysql2'
/**
 * 
 * @param path Il percorso da controllare
 * @returns `true` se è valido, altrimenti una `string` con l'errore
 */
export async function isValidPath(path: string): Promise<string | true> {
    //controlla se esiste
    if (!existsSync(path)) {
        return 'Assicurati di fornire un percorso valido';
    }
    //controlla se è una repository di git
    try {
        if (!await simpleGit(path).checkIsRepo()) throw 1;
    } catch {
        return 'Assicurati di fornire una repository git';
    }

    return true;
}

export async function dbQuery(q: string, params?: any[]) {
    let dbConnection;
    try {
        // connects to the database
        dbConnection = mysql.createConnection(
            useRuntimeConfig().dbconfig
        )
        // Inserisce il valore
        return await dbConnection.promise()
            .query(
                q,
                params
            )
    } catch (error) {
        return error as Error; //console.error("Errore durante l'aggiunta nel database:", error);
    } finally {
        //chiude la connessione
        dbConnection?.end();
    }
}