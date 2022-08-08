import React from "react";
import { Route, Routes } from "react-router-dom";
import FormAnswerScreen from "./form-replies-screen";
import FormHistoryScreen from "./form-history-screen";
import FormsDataScreen from "./forms-data-screen";
import FormsScreen from "./forms-screen";

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
      path="/:formId/answers"
      element={ <FormAnswerScreen/> }
    />
    <Route
      path="/:formSlug/history"
      element={ <FormHistoryScreen/> }
    />
  </Routes>
);

export default FormsRoutes;