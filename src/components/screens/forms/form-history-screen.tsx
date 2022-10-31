import React, { useContext, useEffect, useState } from "react";
import { DataGrid, fiFI, GridColDef } from "@mui/x-data-grid";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";
import { useApiClient } from "app/hooks";
import Api from "api";
import { AuditLogEntry, MetaformMember } from "generated/client";
import { ErrorContext } from "components/contexts/error-handler";
import { useNavigate, useParams } from "react-router-dom";
import FormRestrictedContent from "components/containers/form-restricted-content";
import moment from "moment";
import LocalizationUtils from "utils/localization-utils";

/**
 * Form history screen component
 */
const FormHistoryScreen: React.FC = () => {
  const errorContext = useContext(ErrorContext);

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformMembersApi, auditLogEntriesApi, metaformsApi } = apiClient;
  const [ auditLogEntries, setAuditLogEntries ] = useState<AuditLogEntry[]>([]);
  const [ metaformMembers, setMetaformMembers ] = useState<MetaformMember[]>([]);
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();
  const { formSlug } = useParams();

  /**
   * Loads audit log entries
   *
   * @param metaformId metaform id
   */
  const loadAuditLogEntries = async (metaformId: string) => {
    try {
      // TODO pagination maybe???? Gets heavier as time goes now 35000 entries.
      const logEntries = await auditLogEntriesApi.listAuditLogEntries({
        metaformId: metaformId
      });

      setAuditLogEntries(logEntries);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormHistoryScreen.listAuditLogEntries, e);
    }
  };

  /**
   * Loads metaform members
   *
   * @param metaformId metaform id
   */
  const loadMetaformMembers = async (metaformId: string) => {
    try {
      const members = await metaformMembersApi.listMetaformMembers({
        metaformId: metaformId
      });

      setMetaformMembers(members);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormHistoryScreen.listMetaformMembers, e);
    }
  };

  /**
   * Loads data
   */
  const loadData = async () => {
    setLoading(true);

    try {
      const metaformData = await metaformsApi.findMetaform({ metaformSlug: formSlug });

      await loadAuditLogEntries(metaformData.id!);
      await loadMetaformMembers(metaformData.id!);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormHistoryScreen.findMetaform, e);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: strings.formHistoryScreen.historyTable.date,
      width: 400,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        const formattedDate = moment(params.row.createdAt).format("DD.MM.YYYY HH:mm:ss");
        return (
          <AdminFormListStack direction="row">
            <AdminFormTypographyField>{ formattedDate }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "userId",
      headerName: strings.formHistoryScreen.historyTable.actor,
      width: 400,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        const user = metaformMembers.find(member => member.id === params.row.userId);
        const userName = user === undefined ? strings.generic.unknown : `${user.firstName} ${user.lastName}`;
        return (
          <AdminFormListStack direction="row">
            <AdminFormTypographyField>{ userName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "replyId",
      headerName: strings.formHistoryScreen.historyTable.replyId,
      width: 400,
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
            <AdminFormTypographyField>{ params.row.replyId }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "logEntryType",
      headerName: strings.formHistoryScreen.historyTable.actionPerformed,
      width: 400,
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
            <AdminFormTypographyField>{ LocalizationUtils.getLocalizedAuditLogEntryType(params.row.logEntryType) }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    }
  ];

  /**
   * Component render
   */
  return (
    <>
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.formsScreens.formRepliesScreen }
          to="./../answers"
        />
        <FormRestrictedContent>
          <NavigationTab
            text={ strings.navigationHeader.formsScreens.formHistoryScreen }
          />
        </FormRestrictedContent>
      </NavigationTabContainer>
      <DataGrid
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
        localeText={ fiFI.components.MuiDataGrid.defaultProps.localeText }
        loading={ loading }
        rows={ auditLogEntries }
        columns={ columns }
        onRowDoubleClick={ rowParams => navigate(`./../answers/${rowParams.row.replyId}`) }
      />
    </>
  );
};

export default FormHistoryScreen;