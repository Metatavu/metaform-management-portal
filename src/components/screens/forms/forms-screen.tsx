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
    headerName: "LOMAKE",
    width: 1000,
    renderHeader: params => {
      return (
        <AdminFormListStack direction="row">
          <ListIcon/>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{params.colDef.headerName}</AdminFormTypographyField>
        </AdminFormListStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormListStack direction="row">
          <ListIcon/>
          <AdminFormTypographyField>{params.id}</AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  },
  {
    field: "VIIMEISIN",
    headerName: "VIIMEISIN",
    width: 250,
    renderHeader: params => {
      return (
        <AdminFormListStack direction="row">
          <DateRangeIcon/>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{params.colDef.headerName}</AdminFormTypographyField>
        </AdminFormListStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormListStack direction="row">
          <DateRangeIcon/>
          <AdminFormTypographyField>{params.row.VIIMEISIN}</AdminFormTypographyField>
        </AdminFormListStack>
      );
    }
  },
  {
    field: "UUSIA",
    headerName: "UUSIA",
    width: 250,
    renderHeader: params => {
      return (
        <AdminFormListStack direction="row">
          <NotificationsIcon/>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{params.colDef.headerName}</AdminFormTypographyField>
        </AdminFormListStack>
      );
    },
    renderCell: params => {
      return (
        <AdminFormListStack direction="row">
          <NotificationsActiveIcon style={ { fill: "red " } }/>
          <AdminFormTypographyField>{params.row.UUSIA}</AdminFormTypographyField>
        </AdminFormListStack>
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