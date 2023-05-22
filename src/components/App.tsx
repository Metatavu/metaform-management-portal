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
import DraftPreviewScreen from "./screens/preview/draft-preview-screen";
import FormRestrictedContent from "./containers/form-restricted-content";
import { Helmet } from "react-helmet";
import Config from "app/config";
import ScriptRoutes from "./script-editor/script-routes";
import { selectKeycloak } from "features/auth-slice";

/**
 * Application component
 */
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { locale } = useAppSelector(selectLocale);
  const keycloak = useAppSelector(selectKeycloak);

  React.useLayoutEffect(() => {
    dispatch(setLocale(locale));
    moment.locale(locale);
  }, []);

  return (
    <>
      <Helmet>
        <title>{ Config.get().theme.title }</title>
        <link rel="icon" href={ Config.get().theme.faviconUrl }/>
        <link href={ Config.get().theme.fontFamilyUrl } rel="stylesheet"/>
      </Helmet>
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
                      <FormRestrictedContent route>
                        <AdminLayout>
                          <UsersScreen/>
                        </AdminLayout>
                      </FormRestrictedContent>
                    }
                  />
                  <Route
                    path="/admin/forms/*"
                    element={ <AdminLayout><FormsRoutes/></AdminLayout> }
                  />
                  <Route
                    path="/admin/editor/*"
                    element={
                      <FormRestrictedContent route>
                        <AdminLayout>
                          <EditorRoutes/>
                        </AdminLayout>
                      </FormRestrictedContent>
                    }
                  />
                  <Route
                    path="/admin/preview/:formSlug/:draftId"
                    element={ <BasicLayout><DraftPreviewScreen/></BasicLayout> }
                  />
                  <Route
                    path="/admin/*"
                    element={ <Navigate to="/admin/forms"/> }
                  />
                  <Route
                    path="/*"
                    element={ <PublicLayout><PublicRoutes/></PublicLayout> }
                  />
                  { keycloak?.hasRealmRole("metatavu-admin") &&
                    <Route
                      path="/admin/scripts/*"
                      element={
                        <FormRestrictedContent route>
                          <AdminLayout>
                            <ScriptRoutes/>
                          </AdminLayout>
                        </FormRestrictedContent>
                      }
                    />
                  }
                </Routes>
              </BasicLayout>
            </ConfirmHandler>
          </ErrorHandler>
        </AuthenticationProvider>
      </BrowserRouter>
    </>

  );
};

export default App;