import { Button, Switch, Typography } from "@mui/material";
import { DataGrid, fiFI, GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import Api from "api";
import { useApiClient, useAppDispatch, useAppSelector } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import ConfirmDialog from "components/generic/confirm-dialog";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import { Metaform, MetaformField, MetaformFieldType, Reply, ReplyOrderCriteria, ScriptType } from "generated/client";
import strings from "localization/strings";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NavigationTabContainer } from "styled/layouts/navigations";
import DeleteIcon from "@mui/icons-material/Delete";
import { selectKeycloak } from "features/auth-slice";
import { FormContext, FeatureType, FeatureStrategy, ReplyStatus } from "types";
import FormRestrictedContent from "components/containers/form-restricted-content";
import AuthUtils from "utils/auth-utils";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";
import { setSnackbarMessage } from "features/snackbar-slice";
import theme from "theme";
import LocalizationUtils from "utils/localization-utils";
import { CheckCircle, NewReleases, Pending } from "@mui/icons-material";
import { CREATED_FIELD_NAME, MODIFIED_FIELD_NAME, STATUS_FIELD_NAME } from "consts";
import Feature from "components/containers/feature";
import FileUtils from "utils/file-utils";
import ScriptUtils from "utils/script-utils";

/**
 * Meta fields with type of date-time
 */
const DATETIME_META_FIELDS = [
  MODIFIED_FIELD_NAME,
  CREATED_FIELD_NAME
];

/**
 * Form replies screen component
 */
const FormRepliesScreen: React.FC = () => {
  const errorContext = useContext(ErrorContext);
  const navigate = useNavigate();

  const apiClient = useApiClient(Api.getApiClient);
  const { repliesApi, metaformsApi, scriptsApi } = apiClient;

  const dispatch = useAppDispatch();
  const keycloak = useAppSelector(selectKeycloak);

  const [ rows, setRows ] = useState<any[]>([]);
  const [ replies, setReplies ] = useState<Reply[]>([]);
  const [ columns, setColumns ] = useState<GridColDef[]>([]);
  const [ loading, setLoading ] = useState(false);
  const [ metaform, setMetaform ] = useState<Metaform>();
  const [ deletableReplyId, setDeletableReplyId ] = useState<string | undefined>(undefined);
  const [ showAllReplies, setShowAllReplies ] = useState(false);
  const resultsPerPage = 25;
  const [ page, setPage ] = useState(0);
  const [ totalResults, setTotalResults ] = useState(0);

  const useparams = useParams();
  const { formSlug } = useparams;

  if (!formSlug) {
    errorContext.setError(strings.errorHandling.adminRepliesScreen.formSlugNotFound);
  }

  /**
   * Return fields that include context "MANAGEMENT_LIST"
   *
   * @param metaformData metaform data
   */
  const getManagementListFields = (metaformData: Metaform) => {
    if (!metaformData) {
      return;
    }

    const fieldData = (metaformData.sections ?? [])
      .flatMap(section => section.fields ?? [])
      .filter(field => (field.contexts ?? []).includes(FormContext.MANAGEMENT_LIST));
    return fieldData;
  };

  /**
   * Renders reply status icon
   * 
   * @param replyStatus replyStatus
   */
  const renderReplyStatusIcon = (replyStatus: ReplyStatus) => {
    switch (replyStatus) {
      case ReplyStatus.WAITING:
        return <NewReleases sx={{ color: theme.palette.error.light }}/>;
      case ReplyStatus.PROCESSING:
        return <Pending sx={{ color: theme.palette.warning.light }}/>;
      case ReplyStatus.DONE:
        return <CheckCircle sx={{ color: theme.palette.success.light }}/>;
      default:
        break;
    }
  };

  /**
   * Renders reply status column
   * 
   * @param replyStatus replyStatus
   */
  const renderReplyStatusColumn = (replyStatus: ReplyStatus) => (
    <AdminFormListStack direction="row" spacing={ 2 }>
      { renderReplyStatusIcon(replyStatus) }
      <AdminFormTypographyField>
        { LocalizationUtils.getLocalizedStatusOfReply(replyStatus) }
      </AdminFormTypographyField>
    </AdminFormListStack>
  );

  /**
   * Renders metadata datetime columns
   * 
   * @param datetime datetime
   */
  const renderDateTimeMetaFields = (datetime: string) => (
    <AdminFormListStack direction="row">
      <AdminFormTypographyField>{ moment(datetime).format("LLL") }</AdminFormTypographyField>
    </AdminFormListStack>
  );

  /**
   * Builds the columns for the table
   * Adds delete button column if user has realm role metaform-admin
   *
   * @param metaformData metaform data
   * @returns management list columns
   */
  const setGridColumns = async (metaformData: Metaform) => {
    if (!metaformData) {
      return;
    }

    const managementListColumns = getManagementListFields(metaformData);

    if (!managementListColumns) {
      return;
    }

    const gridColumns = managementListColumns.map<GridColDef>(column => {
      const columnName = column.name ?? "";
      return ({
        field: columnName,
        headerName: column.title,
        allowProps: true,
        flex: 1,
        type: DATETIME_META_FIELDS.includes(columnName) ? "dateTime" : "string",
        renderHeader: params => {
          return (
            <AdminFormListStack direction="row">
              <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
            </AdminFormListStack>
          );
        },
        renderCell: params => {
          switch (columnName) {
            case STATUS_FIELD_NAME:
              return renderReplyStatusColumn(params.row.replyStatus);
            case CREATED_FIELD_NAME:
            case MODIFIED_FIELD_NAME:
              return renderDateTimeMetaFields(params.row[columnName]);
            default:
              return (
                <AdminFormListStack direction="row">
                  <AdminFormTypographyField>{ params.row[columnName] }</AdminFormTypographyField>
                </AdminFormListStack>
              );
          }
        }
      });
    });

    if (AuthUtils.isSystemAdmin(keycloak)) {
      gridColumns.push({
        field: "actions",
        type: "actions",
        width: 140,
        // eslint-disable-next-line react/no-unstable-nested-components
        getActions: (params: { row: any; }) => [
          <GridActionsCellItem
            key={ params.row.id }
            icon={ <DeleteIcon/> }
            onClick={ () => setDeletableReplyId(params.row.id) }
            label={ strings.generic.delete }
            showInMenu
          />
        ]
      } as GridColDef);
    }

    setColumns(gridColumns);
  };

  /**
   * Builds a row for the table
   *
   * @param reply reply
   */
  const buildRow = (reply: Reply, fields: MetaformField[]) => {
    const row : { [key: string]: string | number } = {};

    row.id = reply.id!;

    row.replyStatus = reply.data?.status?.toString() ?? "";

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
        case MetaformFieldType.Select:
        case MetaformFieldType.Radio:
          row[fieldName] = fieldOptions.find(fieldOption => fieldOption.name === fieldValue.toString())?.text ?? fieldValue.toString();
          break;
        default:
          row[fieldName] = replyData[fieldName].toString();
      }
    });

    return row;
  };

  /**
   * Replies screen loadData
   */
  const loadData = async () => {
    if (!formSlug) {
      return;
    }

    setLoading(true);

    try {
      const metaformData = await metaformsApi.findMetaform({ metaformSlug: formSlug });
      setMetaform(metaformData);
      const [ [repliesData, headers], fields ] = await Promise.all([
        repliesApi.listRepliesWithHeaders({
          metaformId: metaformData.id!,
          latestFirst: true,
          orderBy: ReplyOrderCriteria.Created,
          fields: [`${showAllReplies ? "" : "status:waiting"}`],
          firstResult: page * resultsPerPage,
          maxResults: resultsPerPage
        }),
        getManagementListFields(metaformData)
      ]);

      if (!repliesData || !fields) {
        return;
      }
      const replyRows = repliesData.map(reply => buildRow(reply, fields));

      setReplies(repliesData);
      setTotalResults(Number(headers.get("Total-Results")));
      setRows(replyRows);
      await setGridColumns(metaformData);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminRepliesScreen.fetchReplies, e);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [showAllReplies, page]);

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

      dispatch(setSnackbarMessage(strings.successSnackbars.replies.replyDeleteSuccessText));
      setReplies(replies?.filter(reply => reply.id !== replyId));
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
   * Event handler for row double click
   * 
   * @param rowParams rowParams
   */
  const onRowDoubleClick = async (rowParams: GridRowParams<any>) => {
    if (!AuthUtils.isMetaformManager(keycloak)) {
      return;
    }

    return navigate(rowParams.row.id);
  };

  /**
   * Event handler for export button click
   */
  const onExportClick = async () => {
    setLoading(true);

    try {
      if (!metaform?.id) {
        return;
      }

      // eslint-disable-next-line no-underscore-dangle
      const file = await repliesApi._export({ metaformId: metaform.id, format: "XLSX" });

      if (!metaform.scripts) {
        FileUtils.downloadBlob(file, "replies.xlsx");
        return;
      }
      
      const scripts = await Promise.all(metaform.scripts.map(script => scriptsApi.findScript({ scriptId: script })));
      const xlsxScripts = scripts.filter(script => script.type === ScriptType.ExportXlsx);

      let newFile = file;

      const nameClassifierEntries = metaform.sections?.map(section => section.fields)
        .flat().filter(field => !!field && !!field.classifiers && field.title!)
        .map(field => field!.classifiers!.map(classifier => ({ name: field!.title!, classifier: classifier })))
        .flat() ?? [];

      // eslint-disable-next-line no-restricted-syntax
      for (const script of xlsxScripts) {
        // eslint-disable-next-line no-await-in-loop
        newFile = await ScriptUtils.runScriptOnSpreadsheet(newFile, script.content, nameClassifierEntries);
      }

      FileUtils.downloadBlob(newFile, "replies.xlsx");
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminRepliesScreen.export, e);
    }

    setLoading(false);
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
  const renderActions = () => (
    <AdminFormListStack direction="row">
      <Feature
        feature={ FeatureType.EXCEL_EXPORT }
        title={ strings.features.excelExport.title }
        description={ strings.features.excelExport.description }
        strategy={ FeatureStrategy.HIDE }
      >
        <Button onClick={ onExportClick } size="large" sx={{ mr: 2 }}>
          { strings.repliesScreen.export }
        </Button>
      </Feature>
      <Typography>
        { strings.repliesScreen.selectorShowOpen }
      </Typography>
      <Switch onChange={() => { setShowAllReplies(!showAllReplies); }}/>
      <Typography>
        { strings.repliesScreen.selectorShowAll }
      </Typography>
    </AdminFormListStack>
  );

  return (
    <>
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.formsScreens.formRepliesScreen }
          renderActions={ renderActions }
        />
        <FormRestrictedContent>
          <Feature
            feature={FeatureType.AUDIT_LOG }
            title={ strings.features.auditLog.title }
            description={ strings.features.auditLog.description }
            strategy={ FeatureStrategy.DISABLE }
          >
            <NavigationTab
              text={ strings.navigationHeader.formsScreens.formHistoryScreen }
              to="./../history"
            />
          </Feature>
        </FormRestrictedContent>
      </NavigationTabContainer>
      <DataGrid
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
        localeText={ fiFI.components.MuiDataGrid.defaultProps.localeText }
        loading={ loading }
        rows={ rows }
        columns={ columns }
        getRowId={ row => row.id }
        onRowDoubleClick={ onRowDoubleClick }
        pagination
        paginationMode="server"
        pageSize={ resultsPerPage }
        page={ page }
        rowCount={ totalResults }
        onPageChange={ newPage => setPage(newPage) }
        rowsPerPageOptions={ [25] }
      />
      { renderDeleteReplyConfirm() }
    </>
  );
};

export default FormRepliesScreen;