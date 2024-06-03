import { existsSync } from 'fs'
import { platform } from 'process'
import simpleGit from 'simple-git';
import mysql, { type FieldPacket, type QueryResult } from 'mysql2'
/**
 * 
 * @param path Il percorso da controllare
 * @returns `true` se è valido, altrimenti una `string` con l'errore
 */
export async function isValidPath(path: string): Promise<string | true> {
    if (path.length > 200) return 'Lunghezza del percorso troppo alta'
    if (platform === "win32") {
        if (!/^([a-zA-Z]:\\|(\.\.?\\)?)([^\\\/:*?"<>|]+\\)*[^\\\/:*?"<>|]*$/.test(path)) return 'Non un percorso valido';
    } else {
        if (!/^(\/|(\.\.?\/)?)([^\/]+\/)*[^\/]*$/.test(path)) return 'Non un percorso valido';
    }
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
export function isValidEnvironment(environment?: string): string | true {
    if (!environment || typeof environment !== "string" || !environment.length) return 'Assicurati di fornire il campo `enviroment'
    if (environment.length > 30) return 'Lungezza dell\'ambiente troppo larga';

    return true
}

export async function dbQuery<T = {}>(q: string, ...params: any[]): Promise<Error | [T & QueryResult, FieldPacket[]]> {
    let dbConnection;
    try {
        // connects to the database
        dbConnection = mysql.createConnection(
            useRuntimeConfig().dbconfig
        )
        // Inserisce il valore
        return await dbConnection.promise()
            .query<T & QueryResult>(
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