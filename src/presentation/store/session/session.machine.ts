import {api} from "@/services/api";
import {db} from "@/services/indexedDB";
import {createMachine, assign, fromPromise} from "xstate";

import {SessionContext} from "./session.types";

export const sessionMachine = createMachine(
  {
    id: "session",
    initial: "initializing",
    context: {
      user: null,
      error: null,
      products: [],
      companies: [],
      categories: [],
    },
    states: {
      initializing: {
        invoke: {
          src: "loadOfflineData",
          onDone: [
            {
              target: "authenticated.ready",
              guard: "hasOfflineData",
              actions: assign(({event}) => event.output),
            },
            {target: "unauthenticated"},
          ],
          onError: {
            target: "unauthenticated",
          },
        },
      },
      unauthenticated: {
        on: {
          LOGIN_SUCCESS: {
            target: "authenticated",
            actions: assign({user: ({event}) => event.user}),
          },
        },
      },
      authenticated: {
        initial: "loadingUserData",
        states: {
          loadingUserData: {
            invoke: [
              {id: "fetchCompanies", src: "fetchCompanies"},
              {id: "fetchProducts", src: "fetchProducts"},
              {id: "fetchCategories", src: "fetchCategories"},
            ],
            onDone: "persisting",
            on: {
              "done.invoke.fetchCompanies": {
                actions: assign({
                  companies: ({event}) => event.data,
                }),
              },
              "done.invoke.fetchProducts": {
                actions: assign({
                  products: ({event}) => event.data,
                }),
              },
              "done.invoke.fetchCategories": {
                actions: assign({
                  categories: ({event}) => event.data,
                }),
              },
            },
          },
          persisting: {
            invoke: {
              src: "persistData",
              onDone: "ready",
              onError: "ready",
            },
          },
          ready: {
            // O estado final, tudo pronto para uso
          },
          failure: {
            on: {
              RETRY: "loadingUserData",
            },
          },
        },
        on: {
          LOGOUT: {
            target: "unauthenticated",
            actions: assign((context) => ({
              user: null,
              companies: [],
              products: [],
              categories: [],
              error: null,
            })),
          },
        },
      },
    },
  },
  {
    actions: {},
    guards: {
      hasOfflineData: ({event}) =>
        event.output !== null && event.output !== undefined,
    },
    actors: {
      fetchCompanies: fromPromise(async ({input}: {input: SessionContext}) => {
        return await api.fetchCompanies(input.user!.id);
      }),
      fetchProducts: fromPromise(async ({input}: {input: SessionContext}) => {
        return await api.fetchProducts(input.user!.id);
      }),
      fetchCategories: fromPromise(async ({input}: {input: SessionContext}) => {
        return await api.fetchCategories(input.user!.id);
      }),
      persistData: fromPromise(async ({input}: {input: SessionContext}) => {
        await db.saveUserData({
          companies: input.companies,
          products: input.products,
          categories: input.categories,
        });
      }),
      loadOfflineData: fromPromise(async () => await db.loadUserData()),
    },
  }
);
