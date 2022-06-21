import React from "react";
import { Typography } from "@mui/material";
import strings from "localization/strings";
import AppLayout from "components/layouts/app-layout";

/**
 * Main screen component
 */
const MainScreen: React.FC = () => {
  return (
    <AppLayout>
      <Typography>{ strings.generic.notImplemented }</Typography>
    </AppLayout>
  );
};

export default MainScreen;