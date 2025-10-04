import {SessionContext} from "../store/session/session.types";

export const db = {
  saveUserData: async (data: Omit<SessionContext, "user" | "error">) => {
    console.log("[DB] Salvando dados no IndexedDB...", data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.setItem("offline_data", JSON.stringify(data));
    console.log("[DB] Dados salvos.");
  },
  loadUserData: async (): Promise<Omit<
    SessionContext,
    "user" | "error"
  > | null> => {
    console.log("[DB] Carregando dados do IndexedDB...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = localStorage.getItem("offline_data");
    if (data) {
      console.log("[DB] Dados carregados.");
      return JSON.parse(data);
    }
    console.log("[DB] Nenhum dado offline encontrado.");
    return null;
  },
};
