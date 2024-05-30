import simpleGit, { SimpleGitOptions } from "simple-git";

export default class GitBranch {
    public git;
    constructor(options?: Partial<SimpleGitOptions>) {
        this.git = simpleGit(undefined, options)
    }

    async getBranches(path: string) {
        await this.git.cwd(path)
        let branches = await this.git.branch()
        return branches;
    }
    async getBranchURL(branch: string) {
        const remotes = await this.git.getRemotes(true);
        const originRemote = remotes.find(remote => remote.name === 'origin');

        if (!originRemote) {
            return ""
        }
        const baseUrl = originRemote.refs.fetch.replace(/\.git$/, '');

        return `${baseUrl}/tree/${branch}`;
    }
    async getLastCommitInfo(branch: string) {
        // Checkout to the specified branch
        await this.git.checkout(branch);

        // Get the log of the branch and extract the latest commit
        const { latest } = await this.git.log({ n: 1 });
        return latest ?? undefined;
    }
}