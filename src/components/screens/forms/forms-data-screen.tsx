import React, { useContext, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import ListIcon from "@mui/icons-material/List";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";
import { useApiClient } from "app/hooks";
import Api from "api";
import { AuditLogEntry, Metaform, MetaformMemberRole, Reply } from "generated/client";
import { ErrorContext } from "components/contexts/error-handler";
import MetaformUtils from "utils/metaform-utils";
import moment from "moment";
import { EqualizerRounded, HistoryRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/**
 * Interface for single form row
 */
interface Row {
  id: string;
  title: string;
  slug?: string;
  monthlyReplies: number,
  replyViewDelay: moment.Duration
}

/**
 * Forms data screen component
 */
const FormsDataScreen: React.FC = () => {
  const errorContext = useContext(ErrorContext);

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, repliesApi, auditLogEntriesApi } = apiClient;
  const [ rows, setRows ] = useState<Row[]>([]);
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();

  /**
   * Builds a row for the table
   *
   * @param form form
   * @param replies replies
   * @param auditLogEntries audit log entries
   */
  const buildRow = (form: Metaform, replies: Reply[], auditLogEntries: AuditLogEntry[]): Row => {
    const monthlyAverageReplies = MetaformUtils.getMonthlyAverageReply(replies);
    const averageReplyViewDelay = MetaformUtils.getAverageReplyViewDelay(auditLogEntries);

    return {
      id: form.id || "",
      title: form.title || strings.formScreen.noTitle,
      slug: form.slug,
      monthlyReplies: monthlyAverageReplies,
      replyViewDelay: averageReplyViewDelay
    };
  };

  /**
   * Loads forms
   *
   * @return metaform list promise
   */
  const loadForms = async (): Promise<Metaform[]> => {
    try {
      return await metaformsApi.listMetaforms({
        memberRole: MetaformMemberRole.Manager
      });
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsDataScreen.listForms, e);
      return [];
    }
  };

  /**
   * Loads relies
   *
   * @param metaformId metaform id
   * @return replies list promise
   */
  const loadReplies = async (metaformId: string): Promise<Reply[]> => {
    try {
      return await repliesApi.listReplies({ metaformId: metaformId });
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsDataScreen.listReplies, e);
      return [];
    }
  };

  /**
   * Loads audit log entries
   *
   * @param metaformId metaform id
   * @return audit log entries list promise
   */
  const loadAuditLogEntries = async (metaformId: string): Promise<AuditLogEntry[]> => {
    try {
      return await auditLogEntriesApi.listAuditLogEntries({ metaformId: metaformId });
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsDataScreen.listAuditLogEntries, e);
      return [];
    }
  };

  /**
   * Loads data
   */
  const loadData = async () => {
    setLoading(true);

    const forms = await loadForms();

    const [ replies, auditLogEntries ] = await Promise.all([
      Promise.all(forms.map(form => loadReplies(form.id!))),
      Promise.all(forms.map(form => loadAuditLogEntries(form.id!)))
    ]);
    const builtRows = forms.map((form, i) => buildRow(form, replies[i], auditLogEntries[i]));

    setRows(builtRows);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const { form, average, monthlyReplies, processingDelay } = strings.formsDataScreen.formDataTable;

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: form,
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
            <AdminFormTypographyField>{ params.row.title }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "monthlyReplies",
      headerName: monthlyReplies,
      width: 250,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <EqualizerRounded style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <EqualizerRounded style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField>{ `${average} ${Math.floor(params.row.monthlyReplies)}` }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "replyViewDelay",
      headerName: processingDelay,
      width: 250,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <HistoryRounded style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        const duration = params.row.replyViewDelay as moment.Duration;
        const minutes = duration.minutes();
        const days = duration.days();
        const hours = duration.hours();

        const delayString = `${average} ${days} d ${hours} h ${minutes} min`;
        return (
          <AdminFormListStack direction="row">
            <HistoryRounded style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField>{ delayString }</AdminFormTypographyField>
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
          text={ strings.navigationHeader.formsScreens.formScreen }
          to="./.."
        />
        <NavigationTab
          text={ strings.navigationHeader.formsScreens.formDataScreen }
        />
      </NavigationTabContainer>
      <DataGrid
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
        loading={ loading }
        rows={ rows }
        columns={ columns }
        onRowDoubleClick={ rowParams => navigate(`./../${rowParams.row.slug}/answers`) }
      />
    </>
  );
};

export default FormsDataScreen;