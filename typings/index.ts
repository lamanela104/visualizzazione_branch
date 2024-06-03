/**
 * DataType of `environment` table in Database
 */
export interface DBEnvironmentT {
    /**
     * PRIMARY KEY INT
     * the id of a record
     */
    readonly ID: number
    /**
     * UNIQUE VARCHAR(30)
     * The environment that is in the link
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
    
    // ? add a recursive function for fetching `recursive: boolean`
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
export interface DataT {
    /**
     * All the environments record processed from the database
     */
    environments: EnvironmentT[]
    /**
     * All the branches valid branches 
     */
    branches: BranchT[]
}

/**
 * DataType for creating an object for the database
 */
export type AddEnvironmentObjectT = Omit<DBEnvironmentT, "ID">

export * from './utils'