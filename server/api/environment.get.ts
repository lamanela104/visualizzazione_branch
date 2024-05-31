import { DBEnvironmentT, EnvironmentT } from '~/typings'
import mysql from 'mysql2'
import GitBranch from '../../utils/gitutils'
import { dbQuery } from '~/utils/back'
export default defineEventHandler(async (event) => {
    let environmentRows: DBEnvironmentT[]
    const query = dbQuery("SELECT * FROM environment");
    if(query instanceof Error) {
        console.error(query.message)
        setResponseStatus(event, 500, query.message)
        return
    }
    try {
        console.time("git")
        // Ottiene le branches per ogni percoso segnato sul db
        const promiseOutput: Promise<EnvironmentT>[] = environmentRows.map(async (val) => {
            let gb = new GitBranch(val.path);
            const { current : branch } = await gb.getBranches();
            const [url, commit] = await Promise.all([
                gb.getBranchURL(branch),
                gb.getLastCommitInfo(branch)
            ])
            return {
                ...val,
                url,
                commit: !commit ? undefined : {
                    author_email: commit.author_email,
                    author_name: commit.author_name,
                    date: commit.date,
                    hash: commit.hash,
                    message: commit.message
                },
                branch
            }
        })
        const output = await Promise.all(promiseOutput);
        setResponseStatus(event, 200, "OK")
        console.timeEnd("git")
        return output
    } catch (error) {
        console.error('Errore durante la visualizzazione delle branch:', error);
        setResponseStatus(event, 500, 'Si è verificato un errore imprevisto di git')
    }
})