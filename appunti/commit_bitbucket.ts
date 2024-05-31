interface BitBucketCommitT {
    values:  Value[];
    pagelen?: number;
    next?:    string;
}
type ReturnT = {
    hash: string,
    author: string
    message: string
    date: Date
}
interface Value {
 //   type:       "commit";
    hash:       string; // 160 bits, 40 hex char
    date:       Date; // string
    author:     Author;
    message:    string;
    summary:    Summary;
    links:      ValueLinks;
    parents:    Parent[];
    rendered:   Rendered;
    repository: Repository;
}

interface Author {
  //  type: "author";
    raw:  string;
   // user: User; 
}

interface HRef {
    href: string;
}

interface ValueLinks {
    self:     HRef;
    html:     HRef;
    diff:     HRef;
    approve:  HRef;
    comments: HRef;
    statuses: HRef;
}

interface Parent {
    hash:  string;
    links: ParentLinks;
    type:  string;
}

interface ParentLinks {
    self: HRef;
    html: HRef;
}

interface Rendered {
    message: Summary;
}

interface Summary {
    type:   "rendered";
    raw:    string; //  title
    markup: "markdown" | string;
    // html:   string;
}

interface Repository {
    type:      "repository";
    full_name: string; // NAME <email>
   // links:     UserLinks;
    name:      string;
    uuid:      string;
}
