import { FormControlLabel, Switch, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import React from "react";
import { NavigationTabContainer } from "styled/layouts/navigations";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";

const columns: GridColDef[] = [
  {
    field: "created",
    headerName: strings.navigationHeader.formsScreens.formScreen.form.answers.createdTitle,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormListStack direction="row">
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
        </AdminFormListStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormListStack direction="row">
          <AdminFormTypographyField>{ params.row.created }</AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  },
  {
    field: "changed",
    headerName: strings.navigationHeader.formsScreens.formScreen.form.answers.changedTitle,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormListStack direction="row">
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
        </AdminFormListStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormListStack direction="row">
          <AdminFormTypographyField>{ params.row.changed }</AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  },
  {
    field: "status",
    headerName: strings.navigationHeader.formsScreens.formScreen.form.answers.statusTitle,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormListStack direction="row">
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
        </AdminFormListStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormListStack direction="row">
          <AdminFormTypographyField>{ params.row.status }</AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  },
  {
    field: "name",
    headerName: strings.navigationHeader.formsScreens.formScreen.form.answers.nameTitle,
    flex: 1,
    renderHeader: params => {
      return (
        <AdminFormListStack direction="row">
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
        </AdminFormListStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormListStack direction="row">
          <AdminFormTypographyField>{ params.row.name }</AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  }
];

const rows = [
  {
    id: "1", created: "01.01.2022", changed: "01.01.2022", status: strings.navigationHeader.formsScreens.formScreen.form.answers.statusProgressed, name: "Nimi"
  },
  {
    id: "2", created: "01.01.2022", changed: "01.01.2022", status: strings.navigationHeader.formsScreens.formScreen.form.answers.statusInProgress, name: "Nimi"
  }
];

/**
 * Form answer selector
 */
const FormAnswerSelector = () => (
  <AdminFormListStack direction="row">
    <Typography>{ strings.navigationHeader.formsScreens.formScreen.form.answers.selectorShowOpen }</Typography>
    <FormControlLabel control={<Switch defaultChecked/>} label={ undefined }/>
    <Typography>{ strings.navigationHeader.formsScreens.formScreen.form.answers.selectorShowAll }</Typography>
  </AdminFormListStack>
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