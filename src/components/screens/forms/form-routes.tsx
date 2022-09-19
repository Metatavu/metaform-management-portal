import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import FormHistoryScreen from "./form-history-screen";
import FormReplyScreen from "./form-reply-screen";
import FormRepliesScreen from "./form-replies-screen";
import FormRestrictedContent from "components/containers/form-restricted-content";

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
      element={
        <FormRestrictedContent route>
          <FormHistoryScreen/>
        </FormRestrictedContent>
      }
    />
  </Routes>
);

export default FormRoutes;