/* eslint-disable react/no-unstable-nested-components */
import { FormControlLabel, Switch, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Api from "api";
import { useApiClient } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import ConfirmDialog from "components/generic/confirm-dialog";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import { Metaform, MetaformField, MetaformFieldType, Reply } from "generated/client";
import strings from "localization/strings";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NavigationTabContainer } from "styled/layouts/navigations";
import { AdminFormRepliesScreenStack, AdminFormRepliesScreenText } from "styled/react-components/react-components";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [ metaform, setMetaform ] = useState<Metaform>();
  const [ replies, setReplies ] = useState<Reply[]>();
  const [ deletableReplyId, setDeletableReplyId ] = useState<string | undefined>(undefined);
  const [ showAllReplies, setShowAllReplies ] = useState(false);

  const useparams = useParams();
  const { formId } = useparams;

  /**
   * Builds a row for the table
   * 
   * @param reply reply 
   */
  const buildRow = (reply: Reply, fields: MetaformField[]) => {
    const row : { [key: string]: string | number } = {};

    fields.forEach(field => {
      const replyData = reply.data;
      const fieldName = field.name;

      if (!replyData || !fieldName) {
        return;
      }

      const fieldValue = replyData[fieldName];

      if (!fieldValue) {
        return;
      }

      const fieldOptions = field.options || [];

      switch (field.type) {
        case MetaformFieldType.Date:
          row[fieldName] = moment(replyData[fieldName]).format("LLL");
          break;
        case MetaformFieldType.DateTime:
          row[fieldName] = moment(replyData[fieldName]).format("LLL");
          break;
        case MetaformFieldType.Select:
        case MetaformFieldType.Radio:
          row[fieldName] = fieldOptions.find(fieldOption => fieldOption.name === fieldValue.toString())?.text || fieldValue.toString();
          break;
        default:
          row[fieldName] = replyData[fieldName].toString();
      }
    });

    row.replyId = reply.id!;

    return row;
  };

  /**
   * Return fields that include context "MANAGEMENT_LIST" 
   */
  const getManagementListFields = async (metaformData: Metaform) => {
    if (!metaformData) {
      return;
    }

    try {
      const fieldData = (metaformData.sections || [])
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
      const metaformData = await metaformsApi.findMetaform({ metaformId: formId! });
      const repliesData = await repliesApi.listReplies({ metaformId: formId! });
      setMetaform(metaformData);
      setReplies(repliesData);
      const fields = await getManagementListFields(metaformData);
      if (repliesData && fields) {
        const replyRows = repliesData.map(reply => (buildRow(reply, fields)));
        if (showAllReplies) {
          setRows(replyRows);
        } else {
          setRows(replyRows.filter(row => row.status === "Odottaa"));
        }
      }
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminRepliesScreen.fetchReplies, e);
    }
  
    setLoading(false);
  };

  useEffect(() => {
    setup();
  }, [showAllReplies]);

  /**
   * Returns a list of columns
   * 
   * @returns management list columns
   */
  const getGridColumns = () => {
    if (!managementListColumns) {
      return;
    }

    const gridColumns = managementListColumns.map<GridColDef>(column => ({
      field: column.name || "",
      headerName: column.title,
      allowProps: true,
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

    gridColumns.push({
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params: { row: any; }) => [
        <GridActionsCellItem
          icon={ <DeleteIcon/> }
          onClick={ () => setDeletableReplyId(params.row.replyId) }
          label={ strings.generic.delete }
          showInMenu
        />
      ]
    } as GridColDef);

    return gridColumns;
  };

  /**
   * Deletes a reply
   * 
   * @param replyId reply id
   */
  const deleteReply = async (replyId: string) => {
    try {
      if (!metaform || !metaform.id || !replyId) {
        return;
      }
    
      await repliesApi.deleteReply({
        metaformId: metaform.id,
        replyId: replyId
      });
  
      setReplies(replies?.filter(reply => reply.id !== replyId));
      getGridColumns();
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminRepliesScreen.deleteReply, e);
    }
  };
  
  /**
   * Event handler for reply confirm dialog confirm
   */
  const onReplyDeleteConfirm = async () => {
    if (deletableReplyId) {
      deleteReply(deletableReplyId);
    }
  
    setDeletableReplyId(undefined);
  };
  
  /**
     * Renders delete reply confirm dialog
     */
  const renderDeleteReplyConfirm = () => {
    return (
      <ConfirmDialog
        onClose={ () => setDeletableReplyId(undefined) }
        onCancel={ () => setDeletableReplyId(undefined) }
        onConfirm={ onReplyDeleteConfirm }
        cancelButtonText={ strings.generic.cancel }
        positiveButtonText={ strings.generic.confirm }
        title={ strings.repliesScreen.confirmDeleteReplyTitle }
        text={ strings.repliesScreen.confirmDeleteReplyText }
        open={ !!deletableReplyId }
      />
    );
  };
  
  /**
   * Render toggle switch for not processed/all replies
   */
  const renderToggleSwitch = () => (
    <AdminFormRepliesScreenStack direction="row">
      <Typography>{ strings.repliesScreen.selectorShowOpen }</Typography>
      <FormControlLabel control={ <Switch onChange={() => { setShowAllReplies(!showAllReplies); }}/> } label={ undefined }/>
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
          to=":formId/history"
        />
      </NavigationTabContainer>
      <DataGrid
        loading={ loading }
        rows={ rows ?? [] }
        columns={ getGridColumns() ?? [] }
        getRowId={ row => (row.created) }
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
      />
      { renderDeleteReplyConfirm() }
    </>
  );
};

export default FormRepliesScreen;