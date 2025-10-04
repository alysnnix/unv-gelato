import {api} from "@/services/api";
import {db} from "@/services/indexedDB";
import {AppParse} from "@/services/app-parse";
import {createMachine, assign, fromPromise} from "xstate";

import {type SessionContext} from "./types";

const SESSION_DB_ID = 1;

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
    } as SessionContext,
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
            entry: () => console.log("Entering persisting state..."),
            invoke: {
              src: "persistData",
              input: ({context}) => ({context}),
              onDone: "ready",
              onError: {
                target: "ready",
                actions: ({event}) =>
                  console.error("Failed to persist data:", event.actorId),
              },
            },
          },
          ready: {
            entry: () => console.log("Session is ready."),
            type: "final",
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
      persistData: fromPromise(
        async ({input}: {input: {context: SessionContext}}) => {
          console.log("Persisting data to IndexedDB...");
          const {context} = input;
          if (!context.user) return;

          const serializableContext = {
            ...context,
            user: context.user,
            id: SESSION_DB_ID,
          };
          console.log("Data to save:", serializableContext);
          await db.session.put(serializableContext);
        }
      ),
      loadOfflineData: fromPromise(async () => {
        console.log("Loading offline data...");
        const session = await db.session.get(SESSION_DB_ID);
        console.log("Loaded data:", session);
        if (session && session.user) {
          const user = new AppParse.User(session.user);
          return {...session, user};
        }
        return undefined;
      }),
    },
  }
);
