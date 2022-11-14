import React from "react";
import { Route, Routes } from "react-router-dom";
import FormsScreen from "./forms-screen";
import FormRoutes from "./form-routes";
import FormsDataScreen from "./forms-data-screen";
import FormRestrictedContent from "components/containers/form-restricted-content";

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
      element={
        <FormRestrictedContent route>
          <FormsDataScreen/>
        </FormRestrictedContent>
      }
    />
    <Route
      path="/:formSlug/*"
      element={ <FormRoutes/> }
    />
  </Routes>
);

export default FormsRoutes;