import ConnectionHandler from "components/contexts/connection-handler";
import React from "react";
import { Route, Routes } from "react-router-dom";
import FormScreen from "../forms/form-screen";
import PublicFormsScreen from "./public-forms-screen";

/**
 * Component for public routes
 */
const PublicRoutes: React.FC = () => (
  <Routes>
    <Route
      path="/"
      element={ <PublicFormsScreen/> }
    />
    <Route
      path="/:metaformSlug"
      element={ <ConnectionHandler><FormScreen/></ConnectionHandler> }
    />
  </Routes>
);

export default PublicRoutes;