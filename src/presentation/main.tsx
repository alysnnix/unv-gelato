import "./style.css";

import {lazy, StrictMode, Suspense} from "react";
import {createRoot} from "react-dom/client";
import {GlobalProviders} from "./providers/global";

const AppRoutes = lazy(() =>
  import("./router").then((mod) => ({default: mod.AppRoutes}))
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalProviders>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </GlobalProviders>
  </StrictMode>
);
