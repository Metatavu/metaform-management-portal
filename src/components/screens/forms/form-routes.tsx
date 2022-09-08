import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import FormHistoryScreen from "./form-history-screen";
import FormReplyScreen from "./form-reply-screen";
import FormRepliesScreen from "./form-replies-screen";

/**
 * Component for form routes
 */
const FormRoutes: React.FC = () => (
  <Routes>
    <Route
      path="/"
      element={ <Navigate to="./answers"/> }
    />
    <Route
      path="/answers"
      element={ <FormRepliesScreen/> }
    />
    <Route
      path="/answers/:replyId"
      element={ <FormReplyScreen/> }
    />
    <Route
      path="/history"
      element={ <FormHistoryScreen/> }
    />
  </Routes>
);

export default FormRoutes;