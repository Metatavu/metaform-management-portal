import { Button, FormControlLabel, Switch, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Api from "api";
import { useApiClient, useAppSelector } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import ConfirmDialog from "components/generic/confirm-dialog";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import { Metaform, MetaformField, MetaformFieldType, Reply } from "generated/client";
import strings from "localization/strings";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { NavigationTabContainer } from "styled/layouts/navigations";
import { AdminFormRepliesScreenStack, AdminFormRepliesScreenText } from "styled/react-components/react-components";
import DeleteIcon from "@mui/icons-material/Delete";
import { selectKeycloak } from "features/auth-slice";
import { ApplicationRoles, ReplyStatus } from "types";

/**
 * Form replies screen component
 */
const FormRepliesScreen: React.FC = () => {
  const errorContext = useContext(ErrorContext);
  const keycloak = useAppSelector(selectKeycloak);
  
  const apiClient = useApiClient(Api.getApiClient);
  const { repliesApi, metaformsApi } = apiClient;

  const [ rows, setRows ] = useState<any[]>([]);
  const [ filteredRows, setFilteredRows] = useState<any[]>([]);
  const [ columns, setColumns ] = useState<GridColDef[]>([]);
  const [ loading, setLoading ] = useState(false);
  const [ metaform, setMetaform ] = useState<Metaform>();
  const [ deletableReplyId, setDeletableReplyId ] = useState<string | undefined>(undefined);
  const [ showAllReplies, setShowAllReplies ] = useState(false);

  const useparams = useParams();
  const { formSlug } = useparams;

  if (!formSlug) {
    errorContext.setError(strings.errorHandling.adminRepliesScreen.formSlugNotFound);
  }

  /**
   * Builds a row for the table
   * 
   * @param reply reply 
   */
  const buildRow = (reply: Reply, fields: MetaformField[]) => {
    const row : { [key: string]: string | number } = {};
    
    row.id = reply.id!;
    
    row.replyStatus = reply.data?.status?.toString() || "";

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
      return fieldData;
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminRepliesScreen.fetchFields, e);
    }
  };

  /**
   * Builds the columns for the table
   * Adds delete button column if user has realm role metaform-admin
   * 
   * @returns management list columns
   */
  const setGridColumns = async (metaformData: Metaform) => {
    if (!metaformData) {
      return;
    }

    const managementListColumns = await getManagementListFields(metaformData);

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

    if (keycloak?.hasRealmRole(ApplicationRoles.METAFORM_ADMIN)) {
      gridColumns.push({
        field: "actions",
        type: "actions",
        width: 80,
        // eslint-disable-next-line react/no-unstable-nested-components
        getActions: (params: { row: any; }) => [
          <GridActionsCellItem
            icon={ <DeleteIcon/> }
            onClick={ () => setDeletableReplyId(params.row.id) }
            label={ strings.generic.delete }
            showInMenu
          />,
          <Button
            variant="outlined"
            color="primary"
            size="small"
          >
            <Link to={params.row.replyId}>{ strings.repliesScreen.open }</Link>
          </Button>
        ]
      } as GridColDef);
    }
    
    setColumns(gridColumns);
  };

  /**
   * Deletes a reply
   * 
   * @param replyId reply id
   */
  const deleteReply = async (replyId: string) => {
    setLoading(true);

    try {
      if (!metaform || !metaform.id || !replyId) {
        return;
      }
    
      await repliesApi.deleteReply({
        metaformId: metaform.id,
        replyId: replyId
      });
  
      setRows(rows?.filter(row => row.id !== replyId));
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminRepliesScreen.deleteReply, e);
    }

    setLoading(false);
  };
  
  /**
   * Event handler for delete reply dialog confirm
   */
  const onReplyDeleteConfirm = async () => {
    if (deletableReplyId) {
      deleteReply(deletableReplyId);
    }
  
    setDeletableReplyId(undefined);
  };

  /**
   * Filter replies
   */
  const filterRows = () => {
    if (!rows) {
      return;
    }

    const filterableRows = [ ...rows ];
  
    if (!showAllReplies) {
      setFilteredRows(filterableRows.filter(row => row.replyStatus === ReplyStatus.WAITING));
    } else {
      setFilteredRows(filterableRows);
    }
  };

  /**
   * Replies screen setup
   */
  const setup = async () => {
    if (!formSlug) {
      return;
    }
    
    setLoading(true);

    try {
      const metaformData = await metaformsApi.findMetaformBySlug({ metaformSlug: formSlug });
      setMetaform(metaformData);

      const [ repliesData, fields ] = await Promise.all([
        repliesApi.listReplies({ metaformId: metaformData.id! }),
        getManagementListFields(metaformData)
      ]);
      
      if (!repliesData || !fields) {
        return;
      }

      const replyRows = repliesData.map(reply => buildRow(reply, fields));
      setRows(replyRows);
      await setGridColumns(metaformData);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminRepliesScreen.fetchReplies, e);
    }
  
    setLoading(false);
  };

  useEffect(() => {
    setup();
  }, []);

  useEffect(() => {
    filterRows();
  }, [showAllReplies, rows]);
  
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
        rows={ filteredRows }
        columns={ columns }
        getRowId={ row => (row.id) }
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
      />
      { renderDeleteReplyConfirm() }
    </>
  );
};

export default FormRepliesScreen;