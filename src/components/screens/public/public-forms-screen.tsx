import { Typography } from "@mui/material";
import PublicLayout from "components/layouts/public-layout";
import strings from "localization/strings";
import React from "react";

/**
 * Public forms screen component
 */
const PublicFormsScreen: React.FC = () => (
  <PublicLayout>
    <Typography>{ strings.generic.notImplemented }</Typography>
  </PublicLayout>
);

export default PublicFormsScreen;