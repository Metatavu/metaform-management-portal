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
    headerName: strings.navigationHeader.formsScreens.formScreen.form.answers.createdTitle,
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
    headerName: strings.navigationHeader.formsScreens.formScreen.form.answers.changedTitle,
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
    headerName: strings.navigationHeader.formsScreens.formScreen.form.answers.statusTitle,
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
    headerName: strings.navigationHeader.formsScreens.formScreen.form.answers.nameTitle,
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
    id: "1", created: "01.01.2022", changed: "01.01.2022", status: strings.navigationHeader.formsScreens.formScreen.form.answers.statusProgressed, name: "Name asd"
  },
  {
    id: "2", created: "01.01.2022", changed: "01.01.2022", status: strings.navigationHeader.formsScreens.formScreen.form.answers.statusInProgress, name: "Name xyz"
  }
];

/**
 * Form answer selector
 */
const FormAnswerSelector = () => (
  <AdminFormAnswerStack direction="row">
    <Typography>{ strings.navigationHeader.formsScreens.formScreen.form.answers.selectorShowOpen }</Typography>
    <FormControlLabel control={<Switch defaultChecked/>} label={ undefined }/>
    <Typography>{ strings.navigationHeader.formsScreens.formScreen.form.answers.selectorShowAll }</Typography>
  </AdminFormAnswerStack>
);

/**
 * Form answer screen component
 */
const FormAnswerScreen: React.FC = () => (
  <>
    <NavigationTabContainer>
      <NavigationTab
        text={ strings.navigationHeader.formsScreens.formScreen }
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