import type { DBEnvironmentT, DataT, EnvironmentT, BranchT } from '~/typings'
import { GitBranch } from '../../utils/git'
import { dbQuery } from '~/utils/back'

export default defineEventHandler(async (event) => {
    const query = await dbQuery<DBEnvironmentT>("SELECT * FROM environment");
    if (query instanceof Error) {
        console.error(query.message)
        setResponseStatus(event, 500, query.message)
        return
    }

    let environmentRows = query[0]
    let branchesOutput: Record<string, BranchT> = {}

    let environments: EnvironmentT[] = []
    try {
        console.time("git")
        // Ottiene le branches per ogni percoso segnato sul db
        const promiseOutput: Promise<EnvironmentT>[] = environmentRows.map(async (val) => {
            let gb = new GitBranch(val.path);
            const { branches, current: branch } = await gb.getBranches();
            branchesOutput = {
                ...branchesOutput,
                ...branches
            }
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
        environments = await Promise.all(promiseOutput);
        console.timeEnd("git")
        setResponseStatus(event, 200, "OK")
    } catch (error) {
        console.error('Errore durante la visualizzazione delle branch:', error);
        setResponseStatus(event, 500, 'Si è verificato un errore imprevisto di git')
        return;
    }
    return {
        environments,
        branches: Object.values(branchesOutput)
    }
})