import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ConfirmHandler from "components/contexts/confirm-handler";
import ErrorHandler from "components/contexts/error-handler";
import FormsRoutes from "./screens/forms/forms-routes";
import UsersScreen from "./screens/users/users-screen";
import EditorRoutes from "./screens/editor/editor-routes";
import BasicLayout from "./layouts/basic-layout";
import AdminLayout from "./layouts/admin-layout";
import PublicLayout from "./layouts/public-layout";
import PublicRoutes from "./screens/public/public-routes";
import AuthenticationProvider from "./containers/access-token-refresh";

/**
 * Application component
 */
const App: React.FC = () => (
  <BrowserRouter>
    <AuthenticationProvider>
      <ErrorHandler>
        <ConfirmHandler>
          <BasicLayout>
            <Routes>
              <Route
                path="/admin"
                element={ <Navigate to="/admin/forms"/> }
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
              <Route
                path="/*"
                element={ <PublicLayout><PublicRoutes/></PublicLayout> }
              />
            </Routes>
          </BasicLayout>
        </ConfirmHandler>
      </ErrorHandler>
    </AuthenticationProvider>
  </BrowserRouter>
);

export default App;