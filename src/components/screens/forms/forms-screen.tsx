import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import ListIcon from "@mui/icons-material/List";
import DateRangeIcon from "@mui/icons-material/DateRange";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";
import { Link } from "react-router-dom";
import { useApiClient } from "app/hooks";
import Api from "api";

interface Row {
  id: string;
  latestReply: string;
  newReply: string;
}

/**
 * Forms screen component
 */
const FormsScreen: React.FC = () => {
  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, repliesApi } = apiClient;

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: strings.navigationHeader.formsScreens.formScreen.form.form,
      flex: 1,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <ListIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <ListIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField><Link to={`${params.id}/answers`}>{ params.id }</Link></AdminFormTypographyField>
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
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <DateRangeIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField>{ params.row.latestReply }</AdminFormTypographyField>
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
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <NotificationsActiveIcon style={ { fill: "red" } }/>
            <AdminFormTypographyField>{ params.row.newReply }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    }
  ];

  const [ rows, setRows ] = useState<Row[]>([]);

  /**
   * View setup
   */
  const setup = async () => {
    const forms = await metaformsApi.listMetaforms({});
    const builtRows = await Promise.all(forms.map(async form => {
      const replies = await repliesApi.listReplies({ metaformId: form.id!! });
      const latestReply = replies.length > 0 ? (replies[0].modifiedAt?.toISOString() || "") : "";

      return {
        id: form.title || strings.formScreen.noTitle,
        latestReply: latestReply,
        newReply: strings.navigationHeader.formsScreens.formScreen.form.notProcessed
      };
    }));

    setRows(builtRows);
  };

  useEffect(() => {
    setup();
  });

  return (
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
};

export default FormsScreen;