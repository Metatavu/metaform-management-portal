import React, { useContext, useEffect, useState } from "react";
import { DataGrid, fiFI, GridColDef } from "@mui/x-data-grid";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";
import { useApiClient } from "app/hooks";
import Api from "api";
import { AuditLogEntry, User } from "generated/client";
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

  const navigate = useNavigate();
  const { formSlug } = useParams();

  const apiClient = useApiClient(Api.getApiClient);
  const { auditLogEntriesApi, metaformsApi, usersApi } = apiClient;

  const [ auditLogEntries, setAuditLogEntries ] = useState<AuditLogEntry[]>([]);
  const [ actors, setActors ] = useState<User[]>([]);
  const [ loading, setLoading ] = useState(false);

  /**
   * Gets audit log entry actors
   * 
   * @param entries entries
   */
  const loadAuditLogEntryActors = async (entries: AuditLogEntry[]) => {
    try {
      const entryActors = entries.map(auditLogEntry => auditLogEntry.userId);
      const distinctActors = [ ...new Set([ ...entryActors ]) ];
      const actorUsers = await Promise.allSettled(distinctActors.map(actor => usersApi.findUser({ userId: actor! })));
      const resolvedActors = actorUsers.reduce<User[]>((allActors, actor) => {
        if (actor.status === "fulfilled") {
          allActors.push(actor.value);
        }

        return allActors;
      }, []);

      setActors(resolvedActors);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormHistoryScreen.listMetaformMembers, e);
    }
  };

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
      await loadAuditLogEntryActors(logEntries);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormHistoryScreen.listAuditLogEntries, e);
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
      type: "dateTime",
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
        const user = actors.find(actor => actor.id === params.row.userId);
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