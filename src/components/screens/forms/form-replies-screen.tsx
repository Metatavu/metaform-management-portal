import { FormControlLabel, Switch, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import React from "react";
import { NavigationTabContainer } from "styled/layouts/navigations";
import { AdminFormRepliesScreenStack, AdminFormRepliesScreenText } from "styled/react-components/react-components";

const columns: GridColDef[] = [
  {
    field: "created",
    headerName: strings.repliesScreen.createdColumnTitle,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormRepliesScreenStack direction="row">
          <AdminFormRepliesScreenText sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormRepliesScreenText>
        </AdminFormRepliesScreenStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormRepliesScreenStack direction="row">
          <AdminFormRepliesScreenText>{ params.row.created }</AdminFormRepliesScreenText>
        </AdminFormRepliesScreenStack>
      );
    }
  },
  {
    field: "modified",
    headerName: strings.repliesScreen.modifiedColumnTitle,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormRepliesScreenStack direction="row">
          <AdminFormRepliesScreenText sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormRepliesScreenText>
        </AdminFormRepliesScreenStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormRepliesScreenStack direction="row">
          <AdminFormRepliesScreenText>{ params.row.modified }</AdminFormRepliesScreenText>
        </AdminFormRepliesScreenStack>
      );
    }
  },
  {
    field: "status",
    headerName: strings.repliesScreen.statusColumnTitle,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormRepliesScreenStack direction="row">
          <AdminFormRepliesScreenText sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormRepliesScreenText>
        </AdminFormRepliesScreenStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormRepliesScreenStack direction="row">
          <AdminFormRepliesScreenText>{ params.row.status }</AdminFormRepliesScreenText>
        </AdminFormRepliesScreenStack>
      );
    }
  },
  {
    field: "name",
    headerName: strings.repliesScreen.nameColumnTitle,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormRepliesScreenStack direction="row">
          <AdminFormRepliesScreenText sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormRepliesScreenText>
        </AdminFormRepliesScreenStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormRepliesScreenStack direction="row">
          <AdminFormRepliesScreenText>{ params.row.name }</AdminFormRepliesScreenText>
        </AdminFormRepliesScreenStack>
      );
    }
  }
];

const rows = [
  {
    id: "1", created: "01.01.2022", modified: "01.01.2022", status: strings.repliesScreen.statusProgressed, name: "Name asd"
  },
  {
    id: "2", created: "01.01.2022", modified: "01.01.2022", status: strings.repliesScreen.statusInProgress, name: "Name xyz"
  }
];

/**
 * Form replies selector
 */
const FormRepliesSelector = () => (
  <AdminFormRepliesScreenStack direction="row">
    <Typography>{ strings.repliesScreen.selectorShowOpen }</Typography>
    <FormControlLabel control={ <Switch defaultChecked/> } label={ undefined }/>
    <Typography>{ strings.repliesScreen.selectorShowAll }</Typography>
  </AdminFormRepliesScreenStack>
);

/**
 * Form replies screen component
 */
const FormRepliesScreen: React.FC = () => (
  <>
    <NavigationTabContainer>
      <NavigationTab
        text={ strings.repliesScreen }
        renderActions={ FormRepliesSelector }
      />
      <NavigationTab
        text={ strings.navigationHeader.formsScreens.formDataScreen }
        to="../data"
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

export default FormRepliesScreen;