import "./style.css";

import {lazy, Suspense} from "react";
import {createRoot} from "react-dom/client";

const LazyApp = lazy(() => import("./app"));

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div>Loading...</div>}>
    <LazyApp />
  </Suspense>
);
