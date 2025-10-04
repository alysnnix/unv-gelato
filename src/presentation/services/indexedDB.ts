import Dexie, {type Table} from "dexie";
import {SessionContext} from "@/store/session/types";

export class SessionDB extends Dexie {
  session!: Table<SessionContext>;

  constructor() {
    super("unv-gelato");
    this.version(1).stores({
      session: "id, user, token",
    });
  }
}

export const db = new SessionDB();
