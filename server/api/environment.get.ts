import type { EnvironmentT, FieldT, BranchT, CommitT } from '~/typings'
import { GitBranch } from '../../utils/git'
import { readJson } from '~/utils/back'

export default defineEventHandler(async (event) => {
    const data: EnvironmentT[] = readJson();

    let branchesOutput: Record<string, BranchT> = {}

    let environments: FieldT[] = []
    let promisesOutput: Promise<FieldT>[]
    try {
        // Ottiene le branches per ogni percoso segnato sul db
        promisesOutput = data.map(async (val, index) => {
            let gb = new GitBranch(val.path);
            //inizia ad ottenere l'id.
            const commitIDPromise = gb.getLastCommitID();
            // Ottiene le branch, per calccolare
            const { branches, current: branch } = await gb.getBranches();
            branchesOutput = {
                ...branchesOutput,
                ...branches
            }

            // Calcola tutto ciò che  serve per creare <FieldT>
            const [branchURL, commit, commit_id] = await Promise.all([
                gb.getBranchURL(branch),
                gb.getLastCommitInfo(branch),
                commitIDPromise
            ])
            return {
                ...val,
                ID: index,
                branch,
                branchURL,
                commit: !commit ? undefined : {
                    id: commit_id,
                    author_email: commit.author_email,
                    author_name: commit.author_name,
                    date: commit.date,
                    hash: commit.hash,
                    message: commit.message
                } as CommitT
            } as FieldT
        })
        environments = await Promise.all(promisesOutput);
    } catch (error) {
        console.error('Errore durante la visualizzazione delle branch:', error);
        setResponseStatus(event, 500, 'Si è verificato un errore imprevisto di git')
        return;
    }
    setResponseStatus(event, 200, "OK")
    return {
        environments,
        branches: Object.values(branchesOutput)
    }
})