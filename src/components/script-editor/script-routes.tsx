import React from "react";
import { Route, Routes } from "react-router-dom";
import ScriptsScreen from "./scripts-screen";
import ScriptEditorScreen from "./script-editor-screen";

/**
 * Component for editor routes
 */
const ScriptRoutes: React.FC = () => (
  <Routes>
    <Route
      path="/"
      element={ <ScriptsScreen/> }
    />
    <Route
      path="/newScript"
      element={ <ScriptEditorScreen/> }
    />
    <Route
      path="/:scriptId"
      element={ <ScriptEditorScreen/> }
    />
  </Routes>
);

export default ScriptRoutes;