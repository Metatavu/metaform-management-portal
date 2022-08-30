import React from "react";
import { Route, Routes } from "react-router-dom";
import DraftEditorScreen from "./draft-editor-screen";
import EditorScreen from "./editor-screen";
import FormEditorScreen from "./form-editor-screen";

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
      path="/:formSlug"
      element={ <FormEditorScreen/> }
    />
    <Route
      path="/:formSlug/:draftId"
      element={ <DraftEditorScreen/> }
    />
  </Routes>
);

export default EditorRoutes;