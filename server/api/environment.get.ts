import { DBEnvironmentT, EnvironmentT } from '~/typings'
import mysql from 'mysql2'
import GitBranch from './gitutils'
export default defineEventHandler(async (event) => {
    try {
        console.time("db")
        // connects to the database
        const connection = mysql.createConnection(
            useRuntimeConfig().dbconfig
        )
        // Prende tutti gli elementi della tabella "branches"
        const [environmentRows]: [DBEnvironmentT[], any] = await connection.promise().query(`SELECT * FROM environment;`) as any
        console.timeEnd("db")
        console.time("git")
        // Ottiene le branches per ogni percoso segnato sul db
        const promiseOutput: Promise<EnvironmentT>[] = environmentRows.map(async (val) => {
            let gb = new GitBranch()
            const branches = await gb.getBranches(val.path);
            const [url, commit] = await Promise.all([
                gb.getBranchURL(branches.current),
                gb.getLastCommitInfo(branches.current)
            ])
            return {
                ...val,
                url, commit,
                branch: branches.current
            }
        })        
        const output = await Promise.all(promiseOutput);
        console.timeEnd("git")
        setResponseStatus(event, 200, "OK")
        return output
    } catch (error) {
        console.error('Errore durante la visualizzazione delle branch:', error);
        setResponseStatus(event, 500, 'Si è verificato un errore imprevisto durante la visualizzazione delle branch')
    }
})