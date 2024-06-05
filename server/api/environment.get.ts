import type { EnvironmentT, FieldT, BranchT } from '~/typings'
import { GitBranch } from '../../utils/git'
import { readJson } from '~/utils/back'

export default defineEventHandler(async (event) => {
    const data: EnvironmentT[] = readJson();

    let branchesOutput: Record<string, BranchT> = {}

    let environments: FieldT[] = []
    try {
        // Ottiene le branches per ogni percoso segnato sul db
        const promiseOutput: Promise<FieldT>[] = data.map(async (val, index) => {
            let gb = new GitBranch(val.path);
            const { branches, current: branch } = await gb.getBranches();
            branchesOutput = {
                ...branchesOutput,
                ...branches
            }
            const [branchURL, commit] = await Promise.all([
                gb.getBranchURL(branch),
                gb.getLastCommitInfo(branch)
            ])
            return {
                ...val,
                ID: index,
                branch,
                branchURL,
                commit: !commit ? undefined : {
                    author_email: commit.author_email,
                    author_name: commit.author_name,
                    date: commit.date,
                    hash: commit.hash,
                    message: commit.message
                }
            }
        })
        environments = await Promise.all(promiseOutput);
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