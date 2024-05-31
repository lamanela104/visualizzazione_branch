import simpleGit, { BranchSummary, SimpleGitOptions } from "simple-git";

export default class GitBranch {
    public git;
    private branches: BranchSummary | undefined;
    constructor(path: string, options?: Partial<SimpleGitOptions>) {
        this.git = simpleGit(path, options)
        this.branches = undefined;
    }
    /**
     * 
     * @returns Un oggetto contenente tutte le branch disponibili, informazioni e quella attualmente selezionata
     */
    async getBranches() {
        this.branches = await this.git.branch()
        return this.branches;
    }
    /**
     * 
     * @param branch 
     * @returns 
     */
    async getBranchURL(branch?: string) {
        const remotes = await this.git.getRemotes(true);
        const originRemote = remotes.find(remote => remote.name === 'origin');

        if (!originRemote) {
            return ""
        }
        const baseUrl = originRemote.refs.fetch.replace(/\.git$/, '');

        return `${baseUrl}/tree/${await this.getCurrentBranch()}`;
    }


    /**
     * @param branch La branch con cui fare `git checkout {branch}`, se omessa proverà a prendere l'ultima inserita, o se non è mai state presa farà `git branch`
     * @returns L'ultimo commit acquisito.
     */
    async getLastCommitInfo(branch?: string) {
        // Checkout to the specified branch
        await this.git.checkout(
            await this.getCurrentBranch(branch)
        );
        // Get the log of the branch and extract the latest commit
        const { latest } = await this.git.log({ n: 1 });
        return latest ?? undefined;
    }

    private async getCurrentBranch(branch?: string) {
        return branch ?? this.branches?.current ?? (await this.getBranches()).current;
    }
}