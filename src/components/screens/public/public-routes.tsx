import ConnectionHandler from "components/contexts/connection-handler";
import React from "react";
import { Route, Routes } from "react-router-dom";
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
  </Routes>
);

export default PublicRoutes;