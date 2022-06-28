import { Typography } from "@mui/material";
import AdminLayout from "components/layouts/admin-layout";
import strings from "localization/strings";
import React from "react";

/**
 * Draft editor screen component
 */
const DraftEditorScreen: React.FC = () => (
  <AdminLayout>
    <Typography>{ strings.generic.notImplemented }</Typography>
  </AdminLayout>
);

export default DraftEditorScreen;