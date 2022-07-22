import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import ListIcon from "@mui/icons-material/List";
import DateRangeIcon from "@mui/icons-material/DateRange";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: strings.navigationHeader.formsScreens.formScreen.form.form,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormListStack direction="row">
          <ListIcon style={ { fill: "darkgrey" } }/>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{params.colDef.headerName}</AdminFormTypographyField>
        </AdminFormListStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormListStack direction="row">
          <ListIcon style={ { fill: "darkgrey" } }/>
          <AdminFormTypographyField><a href={`forms/${params.id}`}>{params.id}</a></AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  },
  {
    field: "latestReply",
    headerName: strings.navigationHeader.formsScreens.formScreen.form.latestReply,
    width: 250,
    renderHeader: params => {
      return (
        <AdminFormListStack direction="row">
          <DateRangeIcon style={ { fill: "darkgrey" } }/>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{params.colDef.headerName}</AdminFormTypographyField>
        </AdminFormListStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormListStack direction="row">
          <DateRangeIcon style={ { fill: "darkgrey" } }/>
          <AdminFormTypographyField>{params.row.latestReply}</AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  },
  {
    field: "newReply",
    headerName: strings.navigationHeader.formsScreens.formScreen.form.newReply,
    width: 250,
    renderHeader: params => {
      return (
        <AdminFormListStack direction="row">
          <NotificationsIcon style={ { fill: "darkgrey" } }/>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{params.colDef.headerName}</AdminFormTypographyField>
        </AdminFormListStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormListStack direction="row">
          <NotificationsActiveIcon style={ { fill: "red" } }/>
          <AdminFormTypographyField>{params.row.newReply}</AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  }
];

const rows = [
  {
    id: "SOSTERI-Huoli-vanhuksesta", latestReply: "01.0.1.2022 16:48", newReply: strings.navigationHeader.formsScreens.formScreen.form.notProcessed
  },
  {
    id: "ESSOTE-Huoli-vanhuksesta", latestReply: "01.0.1.2022 16:48", newReply: "-"
  }
];

/**
 * Forms screen component
 */
const FormsScreen: React.FC = () => (
  <>
    <NavigationTabContainer>
      <NavigationTab
        text={ strings.navigationHeader.formsScreens.formScreen }
      />
      <NavigationTab
        text={ strings.navigationHeader.formsScreens.formDataScreen }
        to="data"
      />
    </NavigationTabContainer>
    <DataGrid
      rows={ rows }
      columns={ columns }
      autoHeight
      disableColumnMenu
      disableColumnSelector
      disableSelectionOnClick
    />
  </>
);

export default FormsScreen;