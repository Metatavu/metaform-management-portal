import React from "react";
import { Typography } from "@mui/material";
import strings from "localization/strings";
import AppLayout from "components/layouts/app-layout";
import Header from "components/layout-components/header";

/**
 * Main screen component
 */
const MainScreen: React.FC = () => {
  return (
    <AppLayout>
      <Header/>
      <Typography>{ strings.generic.notImplemented }</Typography>
    </AppLayout>
  );
};

export default MainScreen;