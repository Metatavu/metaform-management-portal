import React from "react";
import { Route, Routes } from "react-router-dom";
import FormAnswerScreen from "./form-answer-screen";
import FormHistoryScreen from "./form-history-screen";
import FormReplyScreen from "./form-reply-screen";
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
      path="/:formSlug/answers"
      element={ <FormAnswerScreen/> }
    />
    <Route
      path="/:formSlug/history"
      element={ <FormHistoryScreen/> }
    />
    <Route
      path="/:formSlug/:replyId"
      element={ <FormReplyScreen/> }
    />
  </Routes>
);

export default FormsRoutes;