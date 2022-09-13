import React from "react";
import { Route, Routes } from "react-router-dom";
import FormsScreen from "./forms-screen";
import FormRoutes from "./form-routes";
import FormsDataScreen from "./forms-data-screen";
import { useFormAccessControl } from "app/hooks";
import FormRestrictedView from "components/containers/form-content-restricted";
import { PermissionLevel } from "types";

/**
 * Component for forms routes
 */
const FormsRoutes: React.FC = () => {
  useFormAccessControl();

  return (
    <Routes>
      <Route
        path="/"
        element={ <FormsScreen/> }
      />
      <Route
        path="/data"
        element={
          <FormRestrictedView restrictionLevel={ PermissionLevel.METAFORM_ADMIN }>
            <FormsDataScreen/>
          </FormRestrictedView>
        }
      />
      <Route
        path="/:formSlug/*"
        element={ <FormRoutes/> }
      />
    </Routes>
  );
};

export default FormsRoutes;