import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import FormHistoryScreen from "./form-history-screen";
import FormReplyScreen from "./form-reply-screen";
import FormsDataScreen from "./forms-data-screen";
import FormsScreen from "./forms-screen";
import FormRepliesScreen from "./form-replies-screen";

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
      element={ <FormRepliesScreen/> }
    />
    <Route
      path="/:formSlug/answers/:replyId"
      element={ <FormReplyScreen/> }
    />
    <Route
      path="/:formSlug/history"
      element={ <FormHistoryScreen/> }
    />
    <Route
      path="/:formSlug"
      element={ <Navigate to="./answers"/> }
    />
  </Routes>
);

export default FormsRoutes;