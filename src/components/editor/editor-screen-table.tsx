import { DateRangeRounded, Delete, KeyboardArrowDown, ListRounded, MoreVertOutlined, PersonRounded, Settings } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ConfirmDialog from "components/generic/confirm-dialog";
import { Metaform, MetaformVersion, MetaformVersionType } from "generated/client";
import strings from "localization/strings";
import moment from "moment";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminFormListStack, AdminFormTypographyField, VersionListHeader } from "styled/react-components/react-components";
import theme from "theme";

/**
 * Component props
 */
interface Props {
  loading: boolean;
  metaforms: Metaform[];
  metaformVersions: MetaformVersion[];
  deleteMetaformOrVersion: (id: string) => void;
  editMetaformOrDraft: (id: string) => Promise<string>;
}

/**
 * Interface for MetaformVersionRow
 */
interface MetaformVersionRow {
  id: string;
  typeString?: string;
  type?: MetaformVersionType;
  createdAt?: Date;
  modifiedAt?: Date;
  modifierId?: string;
}

/**
 * Table component for Editor screen
 */
const EditorScreenTable: FC<Props> = ({
  loading,
  metaforms,
  metaformVersions,
  deleteMetaformOrVersion,
  editMetaformOrDraft
}) => {
  // TODO: Currently API doesn't return metadata (created/modified dates etc) for Metaforms. 
  // That needs to be changed and after that, this components version row functionality need slight refactoring.
  const navigate = useNavigate();
  const [ popoverAnchorElement, setPopoverAnchorElement ] = useState<HTMLButtonElement | null>(null);
  const [ deleteDialogOpen, setDeleteDialogOpen ] = useState<boolean>(false);
  const [ popoverOpen, setPopoverOpen ] = useState<boolean>(false);
  const [ selectedId, setSelectedId ] = useState<string | undefined>();

  /**
   * Handles popover menu opening
   */
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchorElement(event.currentTarget);
    setPopoverOpen(!popoverOpen);
    setSelectedId(event.currentTarget.id);
  };
  
  /**
   * Handles popover menu close
   */
  const handleMenuClose = () => {
    setPopoverAnchorElement(null);
    setPopoverOpen(!popoverOpen);
    setSelectedId(undefined);
  };

  /**
   * Handles delete confirmation
   */
  const handleDelete = () => {
    deleteMetaformOrVersion(selectedId!);
    setSelectedId(undefined);
    setDeleteDialogOpen(false);
    handleMenuClose();
  };

  /**
   * Renders delete confirm dialog
   */
  const renderDeleteConfirm = () => (
    <ConfirmDialog
      onClose={ () => setSelectedId(undefined) }
      onCancel={ () => setDeleteDialogOpen(!deleteDialogOpen) }
      onConfirm={ handleDelete }
      cancelButtonText={ strings.generic.cancel }
      positiveButtonText={ strings.generic.confirm }
      title={ strings.editorScreen.confirmDeleteVersionTitle }
      text={ strings.editorScreen.confirmDeleteVersionText }
      open={ deleteDialogOpen }
    />
  );

  /**
   * Handles edit button click
   */
  const handleEditClick = async () => {
    handleMenuClose();
    navigate(await editMetaformOrDraft(selectedId!));
  };
  
  /**
   * Renders version menu
   */
  const renderVersionMenu = () => (
    <Popover
      open={ popoverOpen }
      anchorEl={ popoverAnchorElement }
      onClose={ handleMenuClose }
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
    >
      <List sx={{ p: theme.spacing(0.5) }}>
        <ListItem sx={{ p: theme.spacing(0.5) }}>
          <ListItemButton
            sx={{ p: 0 }}
            onClick={ () => setDeleteDialogOpen(!deleteDialogOpen) }
          >
            <ListItemIcon sx={{ minWidth: 0, mr: theme.spacing(1) }}>
              <Delete/>
            </ListItemIcon>
            <ListItemText primary={ strings.generic.delete }/>
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ p: theme.spacing(0.5) }}>
          <ListItemButton
            sx={{ p: 0 }}
            onClick={ handleEditClick }
          >
            <ListItemIcon sx={{ minWidth: 0, mr: theme.spacing(1) }}>
              <Settings/>
            </ListItemIcon>
            <ListItemText primary={ strings.generic.edit }/>
          </ListItemButton>
        </ListItem>
      </List>
    </Popover>
  );

  /**
   * Builds MetaformVersionRow for production version of Metaform
   * 
   * @param id metaform id
   */
  const buildProductionVersion = (id: string): MetaformVersionRow => {
    return {
      id: id,
      typeString: strings.editorScreen.formProductionVersion
    };
  };

  /**
   * Builds MetaformVersionRows
   * 
   * @param metaform metaform
   */
  const buildVersionRows = (metaform: Metaform): MetaformVersionRow[] => {
    const versions = metaformVersions.filter(x => x.data.id as unknown === metaform.id);
    const productionVersion = buildProductionVersion(metaform.id!);
    const versionRows: MetaformVersionRow[] = versions.map((version: MetaformVersion) => {
      return {
        id: version.id!,
        typeString: version.type === MetaformVersionType.Archived ? strings.editorScreen.formVersionArchived : strings.editorScreen.formVersionDraft,
        type: version.type,
        createdAt: version.createdAt!,
        modifiedAt: version.modifiedAt!,
        modifierId: version.lastModifierId!
      };
    });
    versionRows.push(productionVersion);

    return versionRows;
  };

  /**
   * Renders MetaformVersions Listing
   * 
   * @param metaform metaform
   */
  const renderVersionRows = (metaform: Metaform) => {
    const versions = buildVersionRows(metaform);
    
    if (!versions) {
      return;
    }

    return versions.map((version: MetaformVersionRow) => {
      return (
        <ListItem
          key={ version.id }
          sx={{
            width: "100%",
            padding: 0,
            height: "60px"
          }}
        >
          <AdminFormListStack direction="row">
            <Grid container>
              <Grid item md={ 8 }>
                <AdminFormTypographyField>
                  <ListRounded style={{ fill: "darkgrey", marginRight: "0.5rem" }}/>
                  { version.typeString }
                </AdminFormTypographyField>
              </Grid>
              <Grid item md={ 1 }>
                <AdminFormTypographyField>
                  <DateRangeRounded style={{ fill: "darkgrey", marginRight: "0.5rem" }}/>
                  { moment(version.createdAt).format("LLL") }
                </AdminFormTypographyField>
              </Grid>
              <Grid item md={ 1 }>
                <AdminFormTypographyField>
                  <DateRangeRounded style={{ fill: "darkgrey", marginRight: "0.5rem" }}/>
                  { moment(version.modifiedAt).format("LLL") }
                </AdminFormTypographyField>
              </Grid>
              <Grid item md={ 1 }>
                <AdminFormTypographyField>
                  <PersonRounded style={{ fill: "darkgrey", marginRight: "0.5rem" }}/>
                  placeholder_email
                </AdminFormTypographyField>
              </Grid>
              <Grid item md={ 1 } textAlign="right">
                <IconButton
                  id={ version.id }
                  onClick={ e => handleMenuOpen(e) }
                >
                  <MoreVertOutlined/>
                </IconButton>
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
      <VersionListHeader container>
        <Grid item md={ 8 }>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>
            <ListRounded style={{ fill: "darkgrey", marginRight: "0.5rem" }}/>
            { strings.editorScreen.formVersion }
          </AdminFormTypographyField>
        </Grid>
        <Grid item md={ 1 }>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>
            <DateRangeRounded style={{ fill: "darkgrey", marginRight: "0.5rem" }}/>
            { strings.editorScreen.formCreatedAt }
          </AdminFormTypographyField>
        </Grid>
        <Grid item md={ 1 }>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>
            <DateRangeRounded style={{ fill: "darkgrey", marginRight: "0.5rem" }}/>
            { strings.editorScreen.formModifiedAt }
          </AdminFormTypographyField>
        </Grid>
        <Grid item md={ 1 }>
          <AdminFormTypographyField sx={{ fontWeight: "bold" }}>
            <PersonRounded style={{ fill: "darkgrey", marginRight: "0.5rem" }}/>
            { strings.editorScreen.formLastModifier }
          </AdminFormTypographyField>
        </Grid>
      </VersionListHeader>
    );
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
              sx={{
                backgroundColor: "rgba(0,0,0,0.03)",
                padding: "0px"
              }}
            >
              <AccordionSummary
                sx={{
                  backgroundColor: "white",
                  padding: 0
                }}
                expandIcon={ <KeyboardArrowDown style={{ fill: "darkgrey" }}/> }
              >
                <AdminFormTypographyField variant="h3">{ params.row.title }</AdminFormTypographyField>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0 }}>
                <List sx={{ padding: 0 }}>
                  <ListItem
                    key={ params.row.id }
                    sx={{
                      width: "100%",
                      padding: 0
                    }}
                  >
                    <AdminFormListStack direction="row">
                      { renderVersionListHeader() }
                    </AdminFormListStack>
                  </ListItem>
                  { renderVersionRows(params.row) }
                </List>
              </AccordionDetails>
            </Accordion>
          </AdminFormListStack>
        );
      }
    }
  ];

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
          "& .MuiDataGrid-cell": { p: 0 },
          padding: 2
        }}
        loading={ loading }
        rows={ metaforms }
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
      { renderMetaformList() }
      { renderVersionMenu() }
      { renderDeleteConfirm() }
    </>
  );
};

export default EditorScreenTable;