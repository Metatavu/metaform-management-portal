import React from "react";
import { Route, Routes } from "react-router-dom";
import FormsScreen from "./forms-screen";
import FormRoutes from "./form-routes";
import FormAccessControl from "components/containers/form-access-control";

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
      path="/:formSlug"
      element={
        <FormAccessControl>
          <FormRoutes/>
        </FormAccessControl>
      }
    />
  </Routes>
);

export default FormsRoutes;