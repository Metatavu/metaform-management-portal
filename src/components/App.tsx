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
import AdminLayout from "./layouts/admin-layout";
import PublicLayout from "./layouts/public-layout";
import PublicRoutes from "./screens/public/public-routes";
import AuthenticationProvider from "./containers/access-token-refresh";
import MetaformsApiProvider from "./providers/metaforms-api-provider";
import AttachmentsApiProvider from "./providers/attachments-api-provider";
import DraftsApiProvider from "./providers/drafts-api-provider";
import RepliesApiProvider from "./providers/replies-api-provider";

const apiProviders: React.FC<{}>[] = [
  MetaformsApiProvider,
  AttachmentsApiProvider,
  DraftsApiProvider,
  RepliesApiProvider
];

/**
 * Application component
 */
const App: React.FC = () => (
  <AuthenticationProvider>
    <ErrorHandler>
      <ApiProvider providers={ apiProviders }>
        <RepliesApiProvider>
          <AttachmentsApiProvider>
            <MetaformsApiProvider>
              <DraftsApiProvider>
                <RepliesApiProvider>
                  <ConfirmHandler>
                    <BrowserRouter>
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
                    </BrowserRouter>
                  </ConfirmHandler>
                </RepliesApiProvider>
              </DraftsApiProvider>
            </MetaformsApiProvider>
          </AttachmentsApiProvider>
        </RepliesApiProvider>
      </ApiProvider>
    </ErrorHandler>
  </AuthenticationProvider>
);

export default App;