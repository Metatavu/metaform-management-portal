/* eslint-disable */
import { Accordion, AccordionDetails, AccordionSummary, Divider, List, Typography } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { useApiClient } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import strings from "localization/strings";
import React, { useContext, useEffect, useState } from "react";
import Api from "api";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import { Metaform, MetaformVersion, MetaformVersionType } from "generated/client";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { NewUserButton } from "styled/layouts/admin-layout";
import { StarBorderRounded } from "@mui/icons-material";

/**
 * Interface for single Metaform row
 */
interface Row {
  metaform: Metaform;
  versions: MetaformVersion[];
}

/**
 * Editor screen component
 */
const EditorScreen: React.FC = () => {
  const errorContext = useContext(ErrorContext);

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, versionsApi } = apiClient;

  const [ metaforms, setMetaforms ] = useState<Row[]>([]);
  const [ loading, setLoading ] = useState<boolean>(false);

  /**
   * Gets Metaforms and corresponding MetaformVersions 
   */
  const loadMetaforms = async () => {
    setLoading(true);
    
    try {
      const forms = await metaformsApi.listMetaforms({});
      const rows: Row[] = await Promise.all(forms.map(async form => {
        return {
          metaform: form,
          versions: await versionsApi.listMetaformVersions({ metaformId: form.id!! })
        };
      }));

      setMetaforms(rows);
    } catch (e: any) {
      errorContext.setError("Error while listing forms.");
    }

    setLoading(false);
  };

  const columns: GridColDef[] = [
    {
      field: "version",
      headerName: strings.editorScreen.formVersion.toUpperCase(),
      flex: 1,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <ListIcon style={{ fill: "darkgrey" }}/>
            <AdminFormTypographyField>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            { params.row.type === MetaformVersionType.Archived
              ? <ListIcon style={{ fill: "darkgrey" }}/>
              : <StarBorderRounded style={{ fill: "darkgrey" }}/>
            }
            <AdminFormTypographyField>{ params.row.type.toString() }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "createdAt",
      headerName: strings.editorScreen.formCreatedAt.toUpperCase(),
      width: 250,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <CalendarMonthIcon style={{ fill: "darkgrey" }}/>
            <AdminFormTypographyField>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <CalendarMonthIcon style={{ fill: "darkgrey" }}/>
            <AdminFormTypographyField>{ params.row.createdAt.toString() }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "modifiedAt",
      headerName: strings.editorScreen.formModifiedAt.toUpperCase(),
      width: 250,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <CalendarMonthIcon style={{ fill: "darkgrey" }}/>
            <AdminFormTypographyField>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <CalendarMonthIcon style={{ fill: "darkgrey" }}/>
            <AdminFormTypographyField>{ params.row.modifiedAt.toString() }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "lastModifier",
      headerName: strings.editorScreen.formLastModifier.toUpperCase(),
      width: 250,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <PersonIcon style={{ fill: "darkgrey" }}/>
            <AdminFormTypographyField>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <PersonIcon style={{ fill: "darkgrey" }}/>
            <AdminFormTypographyField>{ params.row.lastModifierId }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    }
  ];

  useEffect(() => {
    loadMetaforms();
  }, []);

  /**
   * Renders Metaforms information 
   * 
   * @param metaformRow Row
   * @param idx Index of item in list
   */
  const renderMetaformListItem = (metaformRow: Row, idx: number) => {
    return (
      <React.Fragment key={idx}>
        <AdminFormListStack direction="row">
          <Accordion
            disableGutters
          >
            <AccordionSummary>
              <AdminFormTypographyField>{ metaformRow.metaform.title ?? "No title on Metaform" }</AdminFormTypographyField>
              <SettingsIcon
                style={{ fill: "darkgrey" }}
              />
              <KeyboardArrowDownIcon style={{ fill: "darkgrey " }}/>
            </AccordionSummary>
            <AccordionDetails>
              <DataGrid
                loading={ loading }
                rows={ metaformRow.versions }
                columns={ columns }
                autoHeight
                disableColumnMenu
                disableColumnSelector
                disableSelectionOnClick
                hideFooter
              />
            </AccordionDetails>
          </Accordion>
        </AdminFormListStack>
        <Divider/>
      </React.Fragment>
    );
  };

  /**
   * Renders list of Rows
   */
  const renderMetaformList = () => {
    if (metaforms.length === 0) {
      return (
        <Typography variant="body1">
          No Metaforms found!
        </Typography>
      );
    }

    return (
      <List>
        { metaforms.map((metaformRow: Row, idx: number) => {
          return (
            renderMetaformListItem(metaformRow, idx)
          );
        })}
      </List>
    );
  };

  return (
    <>
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.editorScreens.editorScreen }
        />
        <NewUserButton
          endIcon={ <AddIcon/> }
        >
          { strings.navigationHeader.editorScreens.newFormButton }
        </NewUserButton>
      </NavigationTabContainer>
      <Divider/>
      { renderMetaformList() }
    </>
  );
};

export default EditorScreen;