export interface User {
  id: string;
  name: string;
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
