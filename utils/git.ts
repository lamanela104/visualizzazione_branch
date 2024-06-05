import simpleGit, { type BranchSummary, type SimpleGitOptions, type SimpleGit, type Response, type SimpleGitTaskCallback, type StatusResult, type DefaultLogFields } from "simple-git";

export class GitBranch {
    public git;
    private branches: BranchSummary | undefined;
    constructor(path: string, options?: Partial<SimpleGitOptions>) {
        this.git = simpleGit(path, options)
        this.branches = undefined;
    }
    /**
     * @returns Un oggetto contenente tutte le branch disponibili, informazioni e quella attualmente selezionata
     */
    public async getBranches(): Promise<BranchSummary> {
        return this.branches = await this.git.branch()
    }
    /**
     * 
     * @param branch La branch dalla quale si vuole ricavare l'url
     * @param baseUrl L'url base, se già ricavato evita di fare calcoli ulterioir
     * @returns 
     */
    public async getBranchURL(branch?: string, baseUrl?: string): Promise<string> {
        branch = await this.getCurrentBranch(branch);
        if (!baseUrl) {
            baseUrl = await this.getBaseURL();
        }
        let url = new URL(baseUrl)
        return `${url.origin}/${url.origin.endsWith('github.com') ? 'tree' : 'branches'}/${branch}`
    }
    /**
     * 
     * @returns the URL to get into the repository
     */
    public async getBaseURL(): Promise<string> {
        const remotes = await this.git.getRemotes(true);
        const originRemote = remotes.find(remote => remote.name === 'origin');

        if (!originRemote) {
            return ""
        }
        return originRemote.refs.fetch.replace(/\.git$/, '');
    }

    /**
     * @param branch La branch con cui fare `git checkout {branch}`, se omessa proverà a prendere l'ultima inserita, o se non è mai state presa farà `git branch`
     * @returns L'ultimo commit acquisito.
     */
    public async getLastCommitInfo(branch?: string): Promise<DefaultLogFields | undefined> {
        branch = await this.getCurrentBranch(branch);
        // Checkout to the specified branch
        await this.git.checkout(
            branch
        );

        // Get the log of the branch and extract the latest commit
        const { latest } = await this.git.log({ n: 1 });
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
    /**
     * Emulates `git rev-parse
     * @returns 
     */
    public async getLastCommitID(): Promise<string> {
        const tmp = await this.git.revparse();

        return tmp
    }
}