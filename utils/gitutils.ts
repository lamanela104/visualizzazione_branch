import simpleGit, { type BranchSummary, type SimpleGitOptions, type SimpleGit, type Response, type SimpleGitTaskCallback, type StatusResult } from "simple-git";

export default class GitBranch {
    public git;
    private branches: BranchSummary | undefined;
    constructor(path: string, options?: Partial<SimpleGitOptions>) {
        this.git = simpleGit(path, options)
        this.branches = undefined;

    }
    /**
     * @returns Un oggetto contenente tutte le branch disponibili, informazioni e quella attualmente selezionata
     */
    public async getBranches() {
        return this.branches = await this.git.branch()
    }
    /**
     * 
     * @param branch 
     * @param baseUrl
     * @returns 
     */
    public async getBranchURL(branch?: string, baseUrl?: string) {
        branch = await this.getCurrentBranch(branch);
        if (!baseUrl) {
            const remotes = await this.git.getRemotes(true);
            const originRemote = remotes.find(remote => remote.name === 'origin');

            if (!originRemote) {
                return ""
            }
            baseUrl = originRemote.refs.fetch.replace(/\.git$/, '');
            return `${baseUrl}/tree/${branch}`;
        }
        let url = new URL(baseUrl)
        return `${url.origin}/${url.origin.endsWith('github.com') ? 'tree' : 'branches'}/${branch}`
    }


    /**
     * @param branch La branch con cui fare `git checkout {branch}`, se omessa proverà a prendere l'ultima inserita, o se non è mai state presa farà `git branch`
     * @returns L'ultimo commit acquisito.
     */
    public async getLastCommitInfo(branch?: string, origin?: string) {
        branch = await this.getCurrentBranch(branch);
        // Checkout to the specified branch
        if (origin)
            await this.git.checkoutBranch(
                branch,
                origin
            );
        else
            await this.git.checkout(
                branch
            )

        // Get the log of the branch and extract the latest commit
        const { latest } = await this.git.log({ n:1 });
        return latest ?? undefined;
    }

    private async getCurrentBranch(branch?: string) {
        return branch ?? this.branches?.current ?? (await this.getBranches()).current;
    }

    public async changeBranch(branch: string) {
        return await this.git.checkout(branch);
    }

    public async hasUncommittedChanges(): Promise<boolean> {
        return (await this.git.status()).files.length !== 0
    }
}