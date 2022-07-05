import React from "react";
import { Route, Routes } from "react-router-dom";
import PublicFormScreen from "./public-form-screen";
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
      path="/:formSlug"
      element={ <PublicFormScreen/> }
    />
  </Routes>
);

export default PublicRoutes;