/**
 * DataType of `environment` table in Database
 */
export interface DBEnvironmentT {
    readonly ID: number
    /**
     * UNIQUE VARCHAR(30)
     * The vq
     */
    environment: string
    /**
     * UNIQUE VARCHAR(200)
     * The directory where the repos is contained
     */
    path: string,
    /**
     * VARCHAR(200)
     * The path to be executed when changed branch
     */
    deploy_path: string | null
    // Planned to add a recursive function for fetching `recursive: boolean`
}
export interface DataT {
    environments: EnvironmentT[]
    branches: BranchT[]
}
/**
 * The environment value that arrives to the user
 */
export interface EnvironmentT extends DBEnvironmentT {
    /**
     * URL of the branch
     */
    url: string
    /**
     * The branch currently in
     */
    branch: string,
    
    /**
     * The last commit info. It can be null if it is a new project
     */
    commit?: CommitT
}
/**
 * The datatype of a commit. Contains most significant values of `git log`
 */
export interface CommitT {
    /**
     * Commit's Hash
     */
    hash: string;
    /**
     * Commit's date
     */
    date: string;
    /**
     * Commit's message
     */
    message: string;
    /**
     * Author's displayed name of the commit
     */
    author_name: string;
    /**
     * Author's email of the commit
     */
    author_email: string;
}
/**
 * DataType for creating an object for the database
 */
export type AddEnvironmentObjectT = Omit<DBEnvironmentT, "id">

export interface BranchT {
    name: string

}