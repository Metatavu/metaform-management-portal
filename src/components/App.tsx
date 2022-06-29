import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import AccessTokenRefresh from "components/containers/access-token-refresh";
import ConfirmHandler from "components/contexts/confirm-handler";
import ErrorHandler from "components/contexts/error-handler";
import ApiProvider from "./providers/api-provider";
import FormsRoutes from "./screens/forms/forms-routes";
import UsersScreen from "./screens/users/users-screen";
import EditorRoutes from "./screens/editor/editor-routes";
import BasicLayout from "./layouts/basic-layout";
import PublicFormsScreen from "./screens/public/public-forms-screen";
import AdminLayout from "./layouts/admin-layout";
import PublicLayout from "./layouts/public-layout";

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
          <BasicLayout>
            <Routes>
              <Route
                path="/"
                element={ <PublicLayout><PublicFormsScreen/></PublicLayout> }
              />
              <Route
                path="/admin"
                element={ <AdminLayout><Navigate to="/admin/forms"/></AdminLayout> }
              />
              <Route
                path="/admin/users"
                element={ <AdminLayout><UsersScreen/></AdminLayout> }
              />
              <Route
                path="/admin/forms/*"
                element={ <AdminLayout><FormsRoutes/></AdminLayout> }
              />
              <Route
                path="/admin/editor/*"
                element={ <AdminLayout><EditorRoutes/></AdminLayout> }
              />
            </Routes>
          </BasicLayout>
        </BrowserRouter>
        {/* </AccessTokenRefresh> */}
      </ConfirmHandler>
    </ApiProvider>
  </ErrorHandler>
);

export default App;