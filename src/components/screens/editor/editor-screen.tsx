import { Typography } from "@mui/material";
import AdminLayout from "components/layouts/admin-layout";
import strings from "localization/strings";
import React from "react";

/**
 * Editor screen component
 */
const EditorScreen: React.FC = () => (
  <AdminLayout>
    <Typography>{ strings.generic.notImplemented }</Typography>
  </AdminLayout>
);

export default EditorScreen;