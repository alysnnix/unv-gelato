import type {FC, PropsWithChildren} from "react";
import {Navigate} from "react-router";

export const PrivateProviders: FC<PropsWithChildren> = ({children}) => {
  const query = new URLSearchParams(window.location.search);
  const enable = query.get("private") === "true";

  if (!enable) return <Navigate to="/" replace />;

  return children;
};
