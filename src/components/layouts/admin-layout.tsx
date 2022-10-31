import { Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import GenericSnackbar from "components/generic/generic-snackbar";
import Header from "components/layout-components/header";
import { handleSnackbarClose, selectSnackbar, setSnackbarOpen } from "features/snackbar-slice";
import React, { useEffect } from "react";
import { Content, ContentWrapper } from "styled/layouts/admin-layout";
import Breadcrumbs from "./breadcrumbs/breadcrumbs";
import NavigationHeader from "./navigations/navigation-header";

/**
 * Admin layout component
 *
 * @param props component properties
 */
const AdminLayout: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const { snackbarMessage, snackbarOpen } = useAppSelector(selectSnackbar);

  /**
   * Event handler for snackbar open
   */
  const handleSnackbarOpen = () => snackbarMessage && dispatch(setSnackbarOpen(true));

  useEffect(() => {
    handleSnackbarOpen();
  }, [ snackbarMessage ]);

  /**
   * Component render
   */
  return (
    <>
      <Header/>
      <NavigationHeader/>
      <Breadcrumbs/>
      <ContentWrapper>
        <GenericSnackbar
          open={ snackbarOpen }
          onClose={ () => dispatch(handleSnackbarClose()) }
          autoHideDuration={ 4000 }
          severity="success"
        >
          <Typography variant="body2">
            { snackbarMessage }
          </Typography>
        </GenericSnackbar>
        <Content>
          {children}
        </Content>
      </ContentWrapper>
    </>
  );
};

export default AdminLayout;