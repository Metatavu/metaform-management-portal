import { FormControlLabel, Switch, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import React from "react";
import { NavigationTabContainer } from "styled/layouts/navigations";
import { AdminFormAnswerStack, AdminFormAnswerTypographyField } from "styled/react-components/react-components";

const columns: GridColDef[] = [
  {
    field: "created",
    headerName: strings.navigationHeader.formsScreens.formScreen.form.answerScreen.createdColumnTitle,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormAnswerStack direction="row">
          <AdminFormAnswerTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormAnswerTypographyField>
        </AdminFormAnswerStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormAnswerStack direction="row">
          <AdminFormAnswerTypographyField>{ params.row.created }</AdminFormAnswerTypographyField>
        </AdminFormAnswerStack>
      );
    }
  },
  {
    field: "changed",
    headerName: strings.navigationHeader.formsScreens.formScreen.form.answerScreen.changedColumnTitle,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormAnswerStack direction="row">
          <AdminFormAnswerTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormAnswerTypographyField>
        </AdminFormAnswerStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormAnswerStack direction="row">
          <AdminFormAnswerTypographyField>{ params.row.changed }</AdminFormAnswerTypographyField>
        </AdminFormAnswerStack>
      );
    }
  },
  {
    field: "status",
    headerName: strings.navigationHeader.formsScreens.formScreen.form.answerScreen.statusColumnTitle,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormAnswerStack direction="row">
          <AdminFormAnswerTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormAnswerTypographyField>
        </AdminFormAnswerStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormAnswerStack direction="row">
          <AdminFormAnswerTypographyField>{ params.row.status }</AdminFormAnswerTypographyField>
        </AdminFormAnswerStack>
      );
    }
  },
  {
    field: "name",
    headerName: strings.navigationHeader.formsScreens.formScreen.form.answerScreen.nameColumnTitle,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormAnswerStack direction="row">
          <AdminFormAnswerTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormAnswerTypographyField>
        </AdminFormAnswerStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormAnswerStack direction="row">
          <AdminFormAnswerTypographyField>{ params.row.name }</AdminFormAnswerTypographyField>
        </AdminFormAnswerStack>
      );
    }
  }
];

const rows = [
  {
    id: "1", created: "01.01.2022", changed: "01.01.2022", status: strings.navigationHeader.formsScreens.formScreen.form.answerScreen.statusProgressed, name: "Name asd"
  },
  {
    id: "2", created: "01.01.2022", changed: "01.01.2022", status: strings.navigationHeader.formsScreens.formScreen.form.answerScreen.statusInProgress, name: "Name xyz"
  }
];

/**
 * Form answer selector
 */
const FormAnswerSelector = () => (
  <AdminFormAnswerStack direction="row">
    <Typography>{ strings.navigationHeader.formsScreens.formScreen.form.answerScreen.selectorShowOpen }</Typography>
    <FormControlLabel control={<Switch defaultChecked/>} label={ undefined }/>
    <Typography>{ strings.navigationHeader.formsScreens.formScreen.form.answerScreen.selectorShowAll }</Typography>
  </AdminFormAnswerStack>
);

/**
 * Form answer screen component
 */
const FormAnswerScreen: React.FC = () => (
  <>
    <NavigationTabContainer>
      <NavigationTab
        text={ strings.navigationHeader.formsScreens.formScreen.form.answerScreen }
        renderActions={ FormAnswerSelector }
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

export default FormAnswerScreen;