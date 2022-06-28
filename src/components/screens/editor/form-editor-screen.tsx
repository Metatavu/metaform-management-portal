import { Typography } from "@mui/material";
import AdminLayout from "components/layouts/admin-layout";
import strings from "localization/strings";
import React from "react";

/**
 * Form editor screen component
 */
const FormEditorScreen: React.FC = () => (
  <AdminLayout>
    <Typography>{ strings.generic.notImplemented }</Typography>
  </AdminLayout>
);

export default FormEditorScreen;