export interface User {
  __type: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  get<K extends keyof BaseUser>(key: K): BaseUser[K] | undefined;
}

interface BaseUser {
  ACL: Acl;
  email: string;
  picture: string;
  username: string;
  fullName: string;
  className: string;
  sessionToken: string;
}

interface Acl {
  [objectId: string]: {
    read: boolean;
    write: boolean;
  };
}

export interface Company {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface SessionContext {
  user: User | null;
  companies: Company[];
  products: Product[];
  categories: Category[];
  error: Error | null;
}

export type SessionEvent =
  | {type: "LOGIN_SUCCESS"; user: User}
  | {type: "LOGIN_FAILURE"; error: Error}
  | {type: "LOGOUT"}
  | {type: "RETRY"};
