import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, List, ListItem, Typography } from "@mui/material";
import { ListRounded, KeyboardArrowDown, Settings, DateRangeRounded, PersonRounded, Add } from "@mui/icons-material";
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
import moment from "moment";
import EditorScreenDrawer from "./editor-screen-drawer";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, versionsApi } = apiClient;

  const [ metaforms, setMetaforms ] = useState<Row[]>([]);
  const [ loading, setLoading ] = useState<boolean>(false);

  const [ drawerOpen, setDrawerOpen ] = useState<boolean>(false);

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

  /**
   * Creates new Metaform and MetaformVersion
   */
  const createMetaform = async (metaform: Metaform) => {
    try {
      const newMetaform = await metaformsApi.createMetaform({ metaform: metaform });
      const newMetaformVersion = await versionsApi.createMetaformVersion({
        metaformId: newMetaform.id!!,
        metaformVersion: {
          type: MetaformVersionType.Draft,
          data: { ...newMetaform } as any
        }
      });
      const currentPath = window.location.pathname;
      navigate(`${currentPath}/${newMetaform.slug}/${newMetaformVersion.id}`);
    } catch (e: any) {
      errorContext.setError("Error while creating new Metaform.");
    }
  };

  /**
   * Renders MetaformVersions Listing
   * 
   * @param metaform metaform
   */
  const buildVersionRows = (metaform: Metaform) => {
    const versions = metaforms.find(x => x.metaform.id === metaform.id)?.versions;
    if (!versions) {
      return;
    }

    return versions.map((version: MetaformVersion) => {
      return (
        <ListItem
          key={ version.id!! }
          sx={{ width: "100%" }}
        >
          <AdminFormListStack direction="row">
            <Grid container>
              <Grid item md={9}>
                <AdminFormTypographyField>
                  <ListRounded style={{ fill: "darkgrey" }}/>
                  { version.type === MetaformVersionType.Archived ? strings.editorScreen.formVersionArchived : strings.editorScreen.formVersionDraft }
                </AdminFormTypographyField>
              </Grid>
              <Grid item md={1}>
                <AdminFormTypographyField>
                  <DateRangeRounded style={{ fill: "darkgrey" }}/>
                  { moment(version.createdAt).format("DD.MM.yyyy HH:mm") }
                </AdminFormTypographyField>
              </Grid>
              <Grid item md={1}>
                <AdminFormTypographyField>
                  <DateRangeRounded style={{ fill: "darkgrey" }}/>
                  { moment(version.modifiedAt).format("DD.MM.yyyy HH:mm") }
                </AdminFormTypographyField>
              </Grid>
              <Grid item md={1}>
                <AdminFormTypographyField>
                  <PersonRounded style={{ fill: "darkgrey" }}/>
                  placeholder_email
                </AdminFormTypographyField>
              </Grid>
            </Grid>
          </AdminFormListStack>
        </ListItem>
      );
    });
  };

  /**
   * Renders header for MetaformVersions listing
   */
  const renderVersionListHeader = () => {
    return (
      <Grid container>
        <Grid item md={9}>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>
            <ListRounded style={{ fill: "darkgrey" }}/>
            { strings.editorScreen.formVersion }
          </AdminFormTypographyField>
        </Grid>
        <Grid item md={1}>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>
            <DateRangeRounded style={{ fill: "darkgrey" }}/>
            { strings.editorScreen.formCreatedAt }
          </AdminFormTypographyField>
        </Grid>
        <Grid item md={1}>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>
            <DateRangeRounded style={{ fill: "darkgrey" }}/>
            { strings.editorScreen.formModifiedAt }
          </AdminFormTypographyField>
        </Grid>
        <Grid item md={1}>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>
            <PersonRounded style={{ fill: "darkgrey" }}/>
            { strings.editorScreen.formLastModifier }
          </AdminFormTypographyField>
        </Grid>
        <Divider/>
      </Grid>
    );
  };

  /**
   * Toggles drawer
   */
  const toggleEditorDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const columns: GridColDef[] = [
    {
      field: "metaform",
      flex: 1,
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <Accordion
              disableGutters
            >
              <AccordionSummary
                sx={{ height: 45 }}
                expandIcon={ <KeyboardArrowDown style={{ fill: "darkgrey" }}/> }
              >
                <AdminFormTypographyField>{ params.row.title ?? "No title on Metaform" }</AdminFormTypographyField>
                <Settings style={{ fill: "darkgrey" }}/>
              </AccordionSummary>
              <AccordionDetails>
                <List sx={{ padding: 0 }}>
                  <ListItem
                    key={ params.row.id }
                    sx={{ width: "100%" }}
                  >
                    <AdminFormListStack direction="row">
                      { renderVersionListHeader() }
                    </AdminFormListStack>
                  </ListItem>
                  { buildVersionRows(params.row) }
                </List>
              </AccordionDetails>
            </Accordion>
          </AdminFormListStack>
        );
      }
    }
  ];

  useEffect(() => {
    loadMetaforms();
  }, []);

  /**
   * Renders DataGrid containing available Metaforms
   */
  const renderMetaformList = () => {
    if (metaforms.length === 0) {
      return (
        <Typography variant="body1">
          { strings.editorScreen.noMetaforms }
        </Typography>
      );
    }

    return (
      <DataGrid
        sx={{
          "& .MuiDataGrid-columnHeaders": { display: "none" },
          "& .MuiDataGrid-virtualScroller": { marginTop: "0!important" },
          "& .MuiDataGrid-columnHeaders:focus-within, & .MuiDataGrid-cell:focus-within": { outline: "none" },
          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": { outline: "none" },
          "& .MuiDataGrid-cell": { p: 0 }
        }}
        loading={ loading }
        rows={ metaforms.map(metaform => metaform.metaform) }
        columns={ columns }
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
        getRowHeight={() => "auto"}
      />
    );
  };

  return (
    <>
      <EditorScreenDrawer
        open={ drawerOpen }
        setOpen={ setDrawerOpen }
        createMetaform={ createMetaform }
      />
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.editorScreens.editorScreen }
        />
        <NewUserButton
          endIcon={ <Add/> }
          onClick={ toggleEditorDrawer }
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