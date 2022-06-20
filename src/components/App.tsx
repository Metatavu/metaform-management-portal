import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import AccessTokenRefresh from "components/containers/access-token-refresh";
import ConfirmHandler from "components/contexts/confirm-handler";
import ErrorHandler from "components/contexts/error-handler";
import ApiProvider from "./providers/api-provider";
import FormsRoutes from "./screens/forms/forms-routes";
import UsersScreen from "./screens/users/users-screen";
import EditorRoutes from "./screens/editor/editor-routes";
import AppLayout from "./layouts/app-layout";

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
          <AppLayout>
            <Routes>
              <Route
                path="/"
                element={ <Navigate to="/forms/list"/> }
              />
              <Route
                path="/users"
                element={ <UsersScreen/> }
              />
              <Route
                path="/forms/*"
                element={ <FormsRoutes/> }
              />
              <Route
                path="/editor/*"
                element={ <EditorRoutes/> }
              />
            </Routes>
          </AppLayout>
        </BrowserRouter>
        {/* </AccessTokenRefresh> */}
      </ConfirmHandler>
    </ApiProvider>
  </ErrorHandler>
);

export default App;