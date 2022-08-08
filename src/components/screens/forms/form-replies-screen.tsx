import { FormControlLabel, Switch, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Api from "api";
import { useApiClient } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import { Reply } from "generated/client";
import strings from "localization/strings";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NavigationTabContainer } from "styled/layouts/navigations";
import { AdminFormRepliesScreenStack, AdminFormRepliesScreenText } from "styled/react-components/react-components";
import LocalizationUtils from "utils/localization-utils";

/**
 * Interface for single reply row
 */
interface ReplyRow {
  created: string;
  modified?: string;
  status: string;
  name: string;
}

/**
 * Form replies screen component
 */
const FormRepliesScreen: React.FC = () => {
  const errorContext = useContext(ErrorContext);
  
  const apiClient = useApiClient(Api.getApiClient);
  const { repliesApi } = apiClient;

  const [ rows, setRows ] = useState<ReplyRow[]>([]);
  const [ loading, setLoading ] = useState(false);
  const useparams = useParams();
  const { formId } = useparams;

  /**
   * Builds a row for the table
   * 
   * @param reply reply 
   */
  const buildRow = (reply: Reply) => {
    return {
      created: reply.createdAt?.toLocaleString().slice(0, -3) || "",
      modified: reply.modifiedAt?.toLocaleString().slice(0, -3) || "",
      status: reply.data?.status as (string | undefined) || "",
      name: reply.data?.name as (string | undefined) || ""
    };
  };

  /**
   * View setup
   */
  const setup = async () => {
    setLoading(true);
  
    try {
      const replies = await repliesApi.listReplies({ metaformId: formId!! });
      console.log(replies);
      if (replies) {
        const replyRows = replies.map(reply => (buildRow(reply)));
        setRows(replyRows);
      }
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminRepliesScreen.fetchReplies, e);
    }
  
    setLoading(false);
  };

  useEffect(() => {
    setup();
  }, []);

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
            <AdminFormRepliesScreenText>{ LocalizationUtils.getLocalizedStatusOfReply(params.row.status) }</AdminFormRepliesScreenText>
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
  
  /**
   * Render toggle switch for not processed/all replies
   */
  const renderToggleSwitch = () => (
    <AdminFormRepliesScreenStack direction="row">
      <Typography>{ strings.repliesScreen.selectorShowOpen }</Typography>
      <FormControlLabel control={ <Switch defaultChecked/> } label={ undefined }/>
      <Typography>{ strings.repliesScreen.selectorShowAll }</Typography>
    </AdminFormRepliesScreenStack>
  );
  
  return (
    <>
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.repliesScreen }
          renderActions={ renderToggleSwitch }
        />
        <NavigationTab
          text={ strings.navigationHeader.formsScreens.formDataScreen }
          to=":formSlug/history"
        />
      </NavigationTabContainer>
      <DataGrid
        loading={ loading }
        rows={ rows }
        columns={ columns }
        getRowId={row => row.created}
        autoHeight
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
      />
    </>
  );
};

export default FormRepliesScreen;