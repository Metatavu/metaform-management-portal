import React, { useContext, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import ListIcon from "@mui/icons-material/List";
import DateRangeIcon from "@mui/icons-material/DateRange";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";
import { Link } from "react-router-dom";
import { useApiClient } from "app/hooks";
import Api from "api";
import { Metaform, Reply } from "generated/client";
import { ErrorContext } from "components/contexts/error-handler";
import { ReplyStatus } from "types";

/**
 * Interface for single form row
 */
interface Row {
  id: string;
  slug?: string;
  title: string;
  latestReply: string;
  newReply?: string;
}

/**
 * Forms screen component
 */
const FormsScreen: React.FC = () => {
  const errorContext = useContext(ErrorContext);
  
  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, repliesApi } = apiClient;

  const [ rows, setRows ] = useState<Row[]>([]);
  const [ loading, setLoading ] = useState(false);

  /**
   * Gets the latest reply date of a Metaform
   */
  const getLatestReplyDate = (replies: Reply[]) => {
    if (replies.length < 1) {
      return "";
    }
  
    if (!replies[0].modifiedAt) {
      return "";
    }
      
    return replies[0].modifiedAt.toLocaleString().slice(0, -3);
  };
  
  /**
   * Counts amount of waiting replies to be displayed in the row
   * @param replies replies
   * @return count of waiting replies
   */
  const countWaitingReplies = (replies: Reply[]) => replies.filter(reply => reply.data?.status as (string | undefined) === ReplyStatus.WAITING).length;
  
  /**
   * Builds a row for the table
   * 
   * @param form form
   * @param replies replies
   */
  const buildRow = (form: Metaform, replies: Reply[]) => {
    const amountWaiting = countWaitingReplies(replies);

    return {
      id: form.id || "",
      slug: form.slug || "",
      title: form.title || strings.formScreen.noTitle,
      latestReply: getLatestReplyDate(replies),
      newReply: amountWaiting > 0 ? `${strings.navigationHeader.formsScreens.formScreen.form.notProcessed} (${amountWaiting})` : undefined
    };
  };
  
  /**
   * View setup
   */
  const setup = async () => {
    setLoading(true);
  
    try {
      const forms = await metaformsApi.listMetaforms({});
      const replies = await Promise.all(forms.map(form => repliesApi.listReplies({ metaformId: form.id!! })));
      const builtRows = forms.map((form, i) => buildRow(form, replies[i]));
  
      setRows(builtRows);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsScreen.listForms, e);
    }
  
    setLoading(false);
  };
  
  useEffect(() => {
    setup();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: strings.navigationHeader.formsScreens.formListing.form,
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
            <AdminFormTypographyField><Link to={`${params.row.slug}/answers`}>{ params.row.title }</Link></AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "latestReply",
      headerName: strings.navigationHeader.formsScreens.formScreen.form.latestReply,
      width: 250,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <DateRangeIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <DateRangeIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField>{ params.row.latestReply }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "newReply",
      headerName: strings.navigationHeader.formsScreens.formScreen.form.newReply,
      width: 250,
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
        return (
          <AdminFormListStack direction="row">
            <NotificationsActiveIcon style={{ fill: fill }}/>
            <AdminFormTypographyField>{ params.row.newReply }</AdminFormTypographyField>
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
        <NavigationTab
          text={ strings.navigationHeader.formsScreens.formDataScreen }
          to="data"
        />
      </NavigationTabContainer>
      <DataGrid
        loading={ loading }
        rows={ rows }
        columns={ columns }
        autoHeight
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
      />
    </>
  );
};

export default FormsScreen;