import React from "react";
import { Route, Routes } from "react-router-dom";
import FormsScreen from "./forms-screen";
import FormRoutes from "./form-routes";
import FormsDataScreen from "./forms-data-screen";

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
      path="/data"
      element={ <FormsDataScreen/> }
    />
    <Route
      path="/:formSlug/*"
      element={ <FormRoutes/> }
    />
  </Routes>
);

export default FormsRoutes;