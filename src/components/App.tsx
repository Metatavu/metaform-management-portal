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
import AuthenticationProvider from "./containers/authentication-provider";
import moment from "moment";
import "moment/locale/fi";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectLocale, setLocale } from "features/locale-slice";
import FormRestrictedView from "./containers/form-restricted-view";
import { PermissionLevel } from "types";

/**
 * Application component
 */
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { locale } = useAppSelector(selectLocale);

  React.useLayoutEffect(() => {
    dispatch(setLocale(locale));
    moment.locale(locale);
  }, []);

  return (
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
                  element={
                    <FormRestrictedView restrictionLevel={ PermissionLevel.METAFORM_MANGER }>
                      <AdminLayout>
                        <UsersScreen/>
                      </AdminLayout>
                    </FormRestrictedView>
                  }
                />
                <Route
                  path="/admin/forms/*"
                  element={ <AdminLayout><FormsRoutes/></AdminLayout> }
                />
                <Route
                  path="/admin/editor/*"
                  element={
                    <FormRestrictedView restrictionLevel={ PermissionLevel.METAFORM_MANGER }>
                      <AdminLayout>
                        <EditorRoutes/>
                      </AdminLayout>
                    </FormRestrictedView>
                  }
                />
                <Route
                  path="/admin/*"
                  element={ <Navigate to="/admin/forms"/> }
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
};

export default App;