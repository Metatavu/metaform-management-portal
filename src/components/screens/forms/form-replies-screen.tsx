import { FormControlLabel, Switch, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Api from "api";
import { useApiClient } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import { MetaformField, Reply } from "generated/client";
import strings from "localization/strings";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NavigationTabContainer } from "styled/layouts/navigations";
import { AdminFormRepliesScreenStack, AdminFormRepliesScreenText } from "styled/react-components/react-components";
// import LocalizationUtils from "utils/localization-utils";

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
  const { repliesApi, metaformsApi } = apiClient;

  const [ rows, setRows ] = useState<ReplyRow[]>([]);
  const [ loading, setLoading ] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ managementListColumns, setManagementListColumns ] = useState<MetaformField[]>();

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
   * Return fields that include context "MANAGEMENT_LIST" 
   * 
   */
  const getManagementListFields = async () => {
    try {
      const metaform = await metaformsApi.findMetaform({ metaformId: formId! });
      const fieldData = (metaform.sections || [])
        .flatMap(section => section.fields || [])
        .filter(field => (field.contexts || []).includes("MANAGEMENT_LIST"));
      setManagementListColumns(fieldData);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminRepliesScreen.fetchFields, e);
    }
  };

  /**
   * View setup
   */
  const setup = async () => {
    setLoading(true);
    getManagementListFields();
  
    try {
      const replies = await repliesApi.listReplies({ metaformId: formId! });
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

  const gridColumns = managementListColumns?.map<GridColDef>(column => ({
    field: column.name || "",
    headerName: column.title,
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
          <AdminFormRepliesScreenText>{ column.name ? params.row[column.name] : "" }</AdminFormRepliesScreenText>
        </AdminFormRepliesScreenStack>
      );
    }
  }));
  
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
        columns={ gridColumns ?? [] }
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