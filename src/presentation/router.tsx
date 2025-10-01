import type {FC, PropsWithChildren} from "react";
import {BrowserRouter, Route, Routes} from "react-router";
import {Public} from "./pages/(public)";
import {Dash} from "./pages/(dash)";

export const AppRoutes: FC<PropsWithChildren> = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Public.Home />} />

        <Route path="dash" element={<Dash.Layout />}>
          <Route index element={<Dash.Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
