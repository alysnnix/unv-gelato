export interface User {
  __type: string;
  ACL: Acl;
  email: string;
  picture: string;
  username: string;
  objectId: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
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
