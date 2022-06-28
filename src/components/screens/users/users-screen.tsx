import { Typography } from "@mui/material";
import AdminLayout from "components/layouts/admin-layout";
import strings from "localization/strings";
import React from "react";

/**
 * Users screen component
 */
const UsersScreen: React.FC = () => (
  <AdminLayout>
    <Typography>{ strings.generic.notImplemented }</Typography>
  </AdminLayout>
);

export default UsersScreen;