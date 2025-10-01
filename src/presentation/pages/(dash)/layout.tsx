import {Outlet} from "react-router";
import {PrivateProviders} from "./providers/private";

export const DashLayout = () => {
  return (
    <PrivateProviders>
      <Outlet />
    </PrivateProviders>
  );
};
