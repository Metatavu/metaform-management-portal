import ConnectionHandler from "components/contexts/connection-handler";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedFormScreen from "./protected-form-screen";
import PublicFormScreen from "./public-form-screen";
import PublicWelcomeScreen from "./public-welcome-screen";

/**
 * Component for public routes
 */
const PublicRoutes: React.FC = () => (
  <Routes>
    <Route
      path="/"
      element={ <PublicWelcomeScreen/> }
    />
    <Route
      path="/:metaformSlug"
      element={ <ConnectionHandler><PublicFormScreen/></ConnectionHandler> }
    />
    <Route
      path="protected/:metaformSlug"
      element={ <ConnectionHandler><ProtectedFormScreen/></ConnectionHandler> }
    />
  </Routes>
);

export default PublicRoutes;