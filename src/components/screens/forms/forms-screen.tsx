import React, { useContext, useEffect, useState } from "react";
import { DataGrid, fiFI, GridColDef } from "@mui/x-data-grid";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import ListIcon from "@mui/icons-material/List";
import DateRangeIcon from "@mui/icons-material/DateRange";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";
import { useApiClient } from "app/hooks";
import Api from "api";
import { Metaform, MetaformMemberRole } from "generated/client";
import { ErrorContext } from "components/contexts/error-handler";
import { useNavigate } from "react-router-dom";
import FormRestrictedContent from "components/containers/form-restricted-content";
import moment from "moment";
import { DataValidation } from "utils/data-validation-utils";
import Feature, { Strategy } from "components/containers/feature";

/**
 * Interface for single form row
 */
interface Row {
  id: string;
  slug?: string;
  title: string;
  latestReply?: Date;
  newReply?: number;
}

/**
 * Forms screen component
 */
const FormsScreen: React.FC = () => {
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
   */
  const buildRow = async (form: Metaform) => {
    if (!form.id || !form.slug) {
      return;
    }
    
    const statistics = await metaformStatisticsApi.getStatistics({ metaformId: form.id });
    
    return {
      id: form.id,
      slug: form.slug,
      title: form.title || strings.formScreen.noTitle,
      latestReply: statistics.lastReplyDate,
      newReply: statistics.unprocessedReplies
    };
  };

  /**
   * Loads data
   */
  const loadData = async () => {
    setLoading(true);

    try {
      const forms = await metaformsApi.listMetaforms({
        memberRole: MetaformMemberRole.Manager
      });
      const builtRows = await Promise.all(forms.map(form => buildRow(form)));

      setRows(builtRows.filter(DataValidation.validateValueIsNotUndefinedNorNull));
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsScreen.listForms, e);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: strings.formsScreen.formTable.form,
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
      field: "latestReply",
      headerName: strings.formsScreen.formTable.latestReply,
      width: 250,
      type: "dateTime",
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <DateRangeIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        const latestReplyDate = params.row.latestReply;
        return (
          <AdminFormListStack direction="row">
            <DateRangeIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField>{ latestReplyDate ? moment(latestReplyDate).format("LLL") : "" }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "newReply",
      headerName: strings.formsScreen.formTable.newReply,
      width: 250,
      type: "number",
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <NotificationsIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        const fill = params.row.newReply ? "red" : "gray";
        const newReplies = params.row.newReply > 0 ? strings.formatString(strings.formsScreen.formTable.notProcessed, params.row.newReply) : undefined;
        return (
          <AdminFormListStack direction="row">
            <NotificationsActiveIcon style={{ fill: fill }}/>
            <AdminFormTypographyField>{ newReplies }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    }
  ];

  return (
    <>
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.formsScreens.formScreen }
        />
        <FormRestrictedContent>
          <Feature
            feature="statistics"
            featureName="Datan tarkastelu"
            featureDescription="Lomakkeiden käyttötilastojen tarkastelu. Ominaisuutta ei ole otettu käyttöön."
            strategy={ Strategy.DISABLE}
          >
            <NavigationTab
              text={ strings.navigationHeader.formsScreens.formsDataScreen }
              to="data"
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
        onRowDoubleClick={ rowParams => navigate(`${rowParams.row.slug}/answers`) }
      />
    </>
  );
};

export default FormsScreen;