import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import MenuIcon from "@mui/icons-material/Menu";
import DateRangeIcon from "@mui/icons-material/DateRange";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Stack } from "@mui/material";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "LOMAKE",
    width: 1000,
    renderHeader: params => {
      return (
        <Stack direction="row" alignItems="center">
          <MenuIcon/>
          {params.colDef.headerName}
        </Stack>
      );
    },
    renderCell: params => {
      return (
        <Stack direction="row" alignItems="center">
          <MenuIcon/>
          {params.id}
        </Stack>
      );
    }
  },
  {
    field: "VIIMEISIN",
    headerName: "VIIMEISIN",
    width: 250,
    renderHeader: params => {
      return (
        <Stack direction="row" alignItems="center">
          <DateRangeIcon/>
          {params.colDef.headerName}
        </Stack>
      );
    },
    renderCell: params => {
      return (
        <Stack direction="row" alignItems="center">
          <DateRangeIcon/>
          {params.row.VIIMEISIN}
        </Stack>
      );
    }
  },
  {
    field: "UUSIA",
    headerName: "UUSIA",
    width: 250,
    renderHeader: params => {
      return (
        <Stack direction="row" alignItems="center">
          <NotificationsIcon/>
          {params.colDef.headerName}
        </Stack>
      );
    },
    renderCell: params => {
      return (
        <Stack direction="row" alignItems="center">
          <NotificationsActiveIcon style={ { fill: "red " } }/>
          {params.row.UUSIA}
        </Stack>
      );
    }
  }
];

const rows = [
  {
    id: "SOSTERI-Huoli-vanhuksesta", VIIMEISIN: "01.0.1.2022 16:48", UUSIA: "käsittelämöttämiä"
  },
  {
    id: "ESSOTE-Huoli-vanhuksesta", VIIMEISIN: "01.0.1.2022 16:48", UUSIA: "-"
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
    {/* TODO tune datagrid */}
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
      autoHeight
      disableColumnMenu
      disableColumnSelector
      disableSelectionOnClick
      
    />
  </>
);

export default FormsScreen;