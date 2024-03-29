import React, { useContext, useEffect, useState } from "react";
import { DataGrid, fiFI, GridColDef } from "@mui/x-data-grid";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import ListIcon from "@mui/icons-material/List";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";
import { useApiClient } from "app/hooks";
import Api from "api";
import { Metaform, MetaformMemberRole } from "generated/client";
import { ErrorContext } from "components/contexts/error-handler";
import moment from "moment";
import { EqualizerRounded, HistoryRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataValidation } from "utils/data-validation-utils";

/**
 * Interface for single form row
 */
interface Row {
  id: string;
  title: string;
  slug?: string;
  monthlyReplies: number;
  replyViewDelay: moment.Duration;
}

/**
 * Forms data screen component
 */
const FormsDataScreen: React.FC = () => {
  const errorContext = useContext(ErrorContext);

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, metaformStatisticsApi } = apiClient;
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
  const buildRow = async (form: Metaform) => {
    const { id, slug, title } = form;
    
    if (!id || !slug) {
      return;
    }
    
    const statistics = await metaformStatisticsApi.getStatistics({ metaformId: id });
    const averageReplyProcessDelay = statistics.averageReplyProcessDelay! > 0 ? statistics.averageReplyProcessDelay : 0;
    
    return {
      id: id,
      title: title || strings.formScreen.noTitle,
      slug: slug,
      monthlyReplies: statistics.averageMonthlyReplies ?? 0,
      replyViewDelay: moment.duration(averageReplyProcessDelay, "seconds")
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
   * Loads data
   */
  const loadData = async () => {
    setLoading(true);

    const forms = await loadForms();
    try {
      const builtRows = await Promise.all(forms.map(form => buildRow(form)));

      setRows(builtRows.filter(DataValidation.validateValueIsNotUndefinedNorNull));
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsDataScreen.listForms, e);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const { form, average, monthlyReplies, processingDelay, delayFormat } = strings.formsDataScreen.formDataTable;

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

        const delayString = strings.formatString(delayFormat, days, hours, minutes) as string;
        const averageDelayString = `${average} ${delayString}`;
        return (
          <AdminFormListStack direction="row">
            <HistoryRounded style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField>{ averageDelayString }</AdminFormTypographyField>
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
          text={ strings.navigationHeader.formsScreens.formsDataScreen }
        />
      </NavigationTabContainer>
      <DataGrid
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
        localeText={ fiFI.components.MuiDataGrid.defaultProps.localeText }
        loading={ loading }
        rows={ rows }
        columns={ columns }
        onRowDoubleClick={ rowParams => navigate(`./../${rowParams.row.slug}/answers`) }
      />
    </>
  );
};

export default FormsDataScreen;