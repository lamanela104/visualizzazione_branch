/**
 * DataType of `environment` table in Database
 */
export interface EnvironmentT {
    /**
     * The environment that is in the link
     */
    environment: string
    /**
     * The directory where the repos is contained
     */
    path: string,
    /**
     * The path to be executed when changed branch
     */
    deploy_path: string,
    /**
     * URL of the environment
     */
    environmentURL: string
}
/**
 * The environment value that arrives to the user
 */
export interface FieldT extends EnvironmentT {
    /**
     * The id of a record, it is defined as the index on the json file
     */
    readonly ID: number
    /**
     * URL of the branch
     */
    branchURL: string
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
 * The data of a needed branch
 */
export interface BranchT {
    /**
     * The name of the branch
     */
    name: string
}
/**
 * All the data needed for front-end
 */
export interface FrontendDataT {
    /**
     * All the environments record processed from the database
     */
    environments: FieldT[]
    /**
     * All the branches valid branches 
     */
    branches: BranchT[]
}

/**
 * DataType for creating an object for the database
 */
export type AddEnvironmentObjectT = Omit<EnvironmentT, "ID">
/**
 * The execution of the file output
 */
export interface FileExecutionT {
    stdout: string,
    stderr: string
}