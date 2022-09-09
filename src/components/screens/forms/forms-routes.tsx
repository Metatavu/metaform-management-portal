import React from "react";
import { Route, Routes } from "react-router-dom";
import FormsScreen from "./forms-screen";
import FormRoutes from "./form-routes";

/**
 * Component for forms routes
 */
const FormsRoutes: React.FC = () => (
  <Routes>
    <Route
      path="/"
      element={ <FormsScreen/> }
    />
    <Route
      path="/:formSlug/*"
      element={ <FormRoutes/> }
    />
  </Routes>
);

export default FormsRoutes;