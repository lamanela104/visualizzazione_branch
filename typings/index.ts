export type DBEnvironmentT = {
    /**
     * PRIMARY VARCHAR(200)
     */
    readonly environment: string
    /**
     * VARCHAR(200)
     */
    path: string
}

export interface RawBranchT {
    name: string;
    target: Target; // last commit
    links: BranchLinks; // useful links.html.href
}

export interface EnvironmentT {
    environment: string,
    path: string
    url: string
    commit?: {
        hash: string;
        date: string;
        message: string;
        refs: string;
        body: string;
        author_name: string;
        author_email: string;
    }
}
export type BranchT = {
    name: string,
    link: string // html
    commit: CommitT
}
export type CommitT = {
    author: string,
    hash: string,
    date: Date,
    message: string
}
interface BranchLinks {
    self: HRef;
    commits: HRef;
    html: HRef;
}

interface HRef {
    href: string;
}

interface Target {
    //    type: "commit";
    hash: string;
    date: Date;
    author: Author;
    message: string;
    //  links: TargetLinks;
    //  parents: Parent[];
    //  repository: Repository;
}

interface Author {
    // type: "author";
    raw: string;
    // user: User;
}