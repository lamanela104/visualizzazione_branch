import { existsSync } from 'fs'
import { platform } from 'process'
import simpleGit from 'simple-git';
import type { EnvironmentT } from '../typings';

import { readFileSync } from 'fs'

export * from './execution'
export * from './git'
/**1
 * 
 * @param path Il percorso da controllare
 * @returns `true` se è valido, altrimenti una `string` con l'errore
 */
export async function isValidPath(path: string): Promise<string | true> {
    if (path.length > 200) return 'Lunghezza del percorso troppo alta'

    // Regex per un percorso
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
// // import mysql, { type FieldPacket } from 'mysql2'
// // export async function dbQuery<T extends object>(q: string, ...params: any[]): Promise<Error | [T[], FieldPacket[]]> {
// //     let dbConnection;
// //     try {
// //         // connects to the database
// //         dbConnection = mysql.createConnection(
// //             useRuntimeConfig().dbconfig
// //         )
// //         // Inserisce il valore
// //         let [data, queryPacket] = await dbConnection.promise()
// //             .query(
// //                 q,
// //                 params
// //             );
// //         return [data as T[], queryPacket]
// //     } catch (error) {
// //         return error as Error; //console.error("Errore durante l'aggiunta nel database:", error);
// //     } finally {
// //         //chiude la connessione
// //         dbConnection?.end();
// //     }
// // }


export function readJson(): EnvironmentT[] {
    try {
        const dir = useRuntimeConfig().JSON_DIR
        const value = readFileSync(dir, 'utf-8')
        const data = JSON.parse(value);
        return data
    } catch (e) {
        console.error("Error reading json file: ", e)
        return []
    }
}

