import { FormControlLabel, Switch, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import React from "react";
import { NavigationTabContainer } from "styled/layouts/navigations";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";

// TODO: Use flex to have the columns as same width but causes a infinite loop at the moment

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "LUOTU",
    width: 250,
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
          <AdminFormTypographyField>{ params.id }</AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  },
  {
    field: "latestReply",
    headerName: "MUOKATTU",
    width: 250,
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
          <AdminFormTypographyField>{ params.row.latestReply }</AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  },
  {
    field: "newReply",
    headerName: "TILA",
    width: 250,
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
          <AdminFormTypographyField>{ params.row.newReply }</AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  },
  {
    field: "newReply",
    headerName: "NIMI",
    width: 250,
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
          <AdminFormTypographyField>{ params.row.newReply }</AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  }
];

const rows = [
  {
    id: "01.01.2022", latestReply: "01.01.2022", newReply: strings.navigationHeader.formsScreens.formScreen.form.notProcessed
  },
  {
    id: "01.01.2022", latestReply: "01.01.2022", newReply: "Käsittelyssä"
  }
];

/**
 * Form answer selector
 */
const FormAnswerSelector = () => (
  <AdminFormListStack direction="row">
    <Typography>Näytä avoimet</Typography>
    <FormControlLabel control={<Switch defaultChecked/>} label={undefined}/>
    <Typography>Näytä kaikki</Typography>
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