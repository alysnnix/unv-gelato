import {api} from "@/services/api";
import {db} from "@/services/indexedDB";
import {createMachine, assign, fromPromise} from "xstate";

import {type SessionContext} from "./types";

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
            onDone: "persisting",
          },
          persisting: {
            invoke: {
              src: "persistData",
              input: ({context}) => ({context}),
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
            actions: "clearOfflineData",
          },
        },
      },
    },
  },
  {
    actions: {
      clearOfflineData: assign(() => {
        db.session.clear();
        return {
          user: null,
          companies: [],
          products: [],
          categories: [],
          error: null,
        };
      }),
    },
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
      persistData: fromPromise(async ({input}: {input: {context: SessionContext}}) => {
        const {context} = input;
        await db.session.put(context);
      }),
      loadOfflineData: fromPromise(async () => {
        const session = await db.session.toCollection().last();
        return session;
      }),
    },
  }
);
