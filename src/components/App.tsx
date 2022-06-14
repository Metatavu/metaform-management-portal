import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import AccessTokenRefresh from "components/containers/access-token-refresh";
import MainScreen from "components/screens/main-screen";
import ConfirmHandler from "components/contexts/confirm-handler";
import ErrorHandler from "components/contexts/error-handler";
import ApiProvider from "./providers/api-provider";

const apiProviders: React.FC<{}>[] = [];

/**
 * Application component
 */
const App: React.FC = () => (
  <ErrorHandler>
    <ApiProvider providers={ apiProviders }>
      <ConfirmHandler>
        {/* <AccessTokenRefresh> */}
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={ <MainScreen/> }
            />
          </Routes>
        </BrowserRouter>
        {/* </AccessTokenRefresh> */}
      </ConfirmHandler>
    </ApiProvider>
  </ErrorHandler>
);

export default App;