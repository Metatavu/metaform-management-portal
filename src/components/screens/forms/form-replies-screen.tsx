import { FormControlLabel, Switch, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Api from "api";
import { useApiClient } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import { MetaformField, MetaformFieldType, Reply } from "generated/client";
import strings from "localization/strings";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NavigationTabContainer } from "styled/layouts/navigations";
import { AdminFormRepliesScreenStack, AdminFormRepliesScreenText } from "styled/react-components/react-components";
// import LocalizationUtils from "utils/localization-utils";

/**
 * Form replies screen component
 */
const FormRepliesScreen: React.FC = () => {
  const errorContext = useContext(ErrorContext);
  
  const apiClient = useApiClient(Api.getApiClient);
  const { repliesApi, metaformsApi } = apiClient;

  const [ rows, setRows ] = useState<any[]>([]);
  const [ loading, setLoading ] = useState(false);
  const [ managementListColumns, setManagementListColumns ] = useState<MetaformField[]>();

  const useparams = useParams();
  const { formId } = useparams;

  /**
   * Builds a row for the table
   * 
   * @param reply reply 
   */
  const buildRow = (reply: Reply, fields: MetaformField[]) => {
    const replyData = reply.data;
    console.log("replyData", replyData);
    fields.forEach(field => {
      const fieldName = field.name;
      console.log("fieldName", fieldName);
      if (!replyData || !fieldName) {
        return "";
      }

      const fieldValue = replyData[fieldName];
      if (!fieldValue) {
        return "";
      }

      const fieldOptions = field.options || [];

      switch (field.type) {
        case MetaformFieldType.Date:
          return moment(fieldValue).format("L");
        case MetaformFieldType.DateTime:
          return moment(fieldValue).format("LL");
        case MetaformFieldType.Select:
        case MetaformFieldType.Radio:
          return fieldOptions.find(fieldOption => fieldOption.name === fieldValue.toString())?.text || fieldValue;
        default:
          return fieldValue;
      }
    });
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
      return fieldData;
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminRepliesScreen.fetchFields, e);
    }
  };

  /**
   * View setup
   */
  const setup = async () => {
    setLoading(true);
  
    try {
      const replies = await repliesApi.listReplies({ metaformId: formId! });
      const fields = await getManagementListFields();
      if (replies && fields) {
        const replyRows = replies.map(reply => (buildRow(reply, fields)));
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
        rows={ rows ?? [] }
        columns={ gridColumns ?? [] }
        getRowId={ row => (row ? row.created : 1) }
        autoHeight
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
      />
    </>
  );
};

export default FormRepliesScreen;