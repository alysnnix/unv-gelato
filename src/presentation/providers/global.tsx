import {SessionProvider} from "@/store/session";
import type {FC, PropsWithChildren} from "react";

export const GlobalProviders: FC<PropsWithChildren> = ({children}) => {
  return <SessionProvider>{children}</SessionProvider>;
};
