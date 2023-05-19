import React from "react";
import { Route, Routes } from "react-router-dom";
import ScriptsScreen from "./scripts-screen";

/**
 * Component for editor routes
 */
const ScriptRoutes: React.FC = () => (
  <Routes>
    <Route
      path="/"
      element={ <ScriptsScreen/> }
    />
  </Routes>
);

export default ScriptRoutes;