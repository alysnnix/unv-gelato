import {StrictMode, Suspense} from "react";
import {GlobalProviders} from "./providers/global";
import {AppRoutes} from "./router";

const App = () => (
  <StrictMode>
    <GlobalProviders>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </GlobalProviders>
  </StrictMode>
);

export default App;
