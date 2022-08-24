import React from "react";
import { Route, Routes } from "react-router-dom";
import DraftEditorScreen from "./draft-editor-screen";
import EditorScreen from "./editor-screen";

/**
 * Component for editor routes
 */
const EditorRoutes: React.FC = () => (
  <Routes>
    <Route
      path="/"
      element={ <EditorScreen/> }
    />
    <Route
      path="/:formSlug/:draftId"
      element={ <DraftEditorScreen/> }
    />
  </Routes>
);

export default EditorRoutes;