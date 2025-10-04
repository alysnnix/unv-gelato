import {createActorContext} from "@xstate/react";
import {sessionMachine} from "./machine";

export const SessionContext = createActorContext(sessionMachine);

export const useSession = SessionContext.useActorRef;
export const useSessionSelector = SessionContext.useSelector;

export * from "./types";
