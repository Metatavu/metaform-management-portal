import { Archive, DateRangeRounded, Delete, KeyboardArrowDown, ListRounded, PersonRounded, RestorePage, Settings, StarOutline } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from "@mui/material";
import ConfirmDialog from "components/generic/confirm-dialog";
import GenericLoaderWrapper from "components/generic/generic-loader";
import { Metaform, MetaformVersion, MetaformVersionType } from "generated/client";
import strings from "localization/strings";
import moment from "moment";
import React, { FC, useState } from "react";
import { FormListContainer, FormPagination, FormsContainer } from "styled/editor/metaform-editor";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";
import { DataGrid, GridActionsCellItem, GridColumns, GridRowParams } from "@mui/x-data-grid";
/**
* Component props
*/
interface Props {
  loading: boolean;
  metaforms: Metaform[];
  metaformVersions: MetaformVersion[];
  deleteMetaformOrVersion: (id: string) => void;
  goToEditor: (id: string) => void;
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
  goToEditor
}) => {
  // TODO: Currently API doesn't return metadata (created/modified dates etc) for Metaforms.
  // That needs to be changed and after that, this components version row functionality need slight refactoring.
  const [ deleteDialogOpen, setDeleteDialogOpen ] = useState<boolean>(false);
  const [ selectedId, setSelectedId ] = useState<string | undefined>();
  const [ page, setPage ] = useState(0);
  const [ pageSize, setPageSize ] = useState(25);

  /**
   * Handles delete confirmation
   */
  const handleDelete = () => {
    deleteMetaformOrVersion(selectedId!);
    setSelectedId(undefined);
    setDeleteDialogOpen(false);
  };

  /**
   * Handles delete button click
   * 
   * @param id metaform or version id
   */
  const handleDeleteDialogOpen = (id: string) => {
    setSelectedId(id);
    setDeleteDialogOpen(!deleteDialogOpen);
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

    return versionRows.reverse();
  };

  /**
   * Renders action cell archive items
   * 
   */
  const renderActionCellArchiveItem = (id: string) => (
    <GridActionsCellItem
      icon={ <RestorePage/> }
      label={ strings.generic.restore }
      onClick={ () => goToEditor(id) }
      showInMenu
    />
  );

  /**
   * Renders action cell delete items
   * @param id form or version id
   */
  const renderActionCellDeleteItem = (id: string) => (
    <GridActionsCellItem
      icon={ <Delete/> }
      label={ strings.generic.delete }
      onClick={ () => handleDeleteDialogOpen(id) }
      showInMenu
    />
  );

  /**
   * Renders action cell edit items
   *
   * @param id form or version id
   */
  const renderActionCellEditItem = (id: string) => (
    <GridActionsCellItem
      icon={ <Settings/> }
      label={ strings.generic.edit }
      onClick={ () => goToEditor(id) }
      showInMenu
    />
  );

  /**
   * Renders version icon
   */
  const renderVersionIcon = (type?: MetaformVersionType) => {
    switch (type) {
      case MetaformVersionType.Draft:
        return <ListRounded style={{ fill: "darkgrey" }}/>;
      case MetaformVersionType.Archived:
        return <Archive style={{ fill: "darkgrey" }}/>;
      default:
        return <StarOutline style={{ fill: "darkgrey" }}/>;
    }
  };

  /**
   * Gets columns
   */
  const getColumns = (): GridColumns => [
    {
      field: "typeString",
      headerName: strings.editorScreen.formVersion,
      flex: 1,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <ListRounded style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            { renderVersionIcon(params.row.type) }
            <AdminFormTypographyField>{ params.row.typeString }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "createdAt",
      headerName: strings.editorScreen.formCreatedAt,
      width: 250,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <DateRangeRounded style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <DateRangeRounded style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField>{ moment(params.row.createdAt).format("LLL") }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "modifiedAt",
      headerName: strings.editorScreen.formModifiedAt,
      width: 250,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <DateRangeRounded style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <DateRangeRounded style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField>{ moment(params.row.modifiedAt).format("LLL") }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "lastModifier",
      headerName: strings.editorScreen.formLastModifier,
      width: 250,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <PersonRounded style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: () => {
        return (
          <AdminFormListStack direction="row">
            <PersonRounded style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField>{ strings.generic.notImplemented }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      field: "actions",
      type: "actions",
      headerName: strings.generic.actions,
      width: 150,
      getActions: (row: GridRowParams) => {
        const versionRow = row.row as MetaformVersionRow;
        if (versionRow.type === MetaformVersionType.Archived) {
          return [
            renderActionCellArchiveItem(row.id as string),
            renderActionCellDeleteItem(row.id as string)
          ];
        }

        return [
          renderActionCellEditItem(row.id as string),
          renderActionCellDeleteItem(row.id as string)
        ];
      }
    }
  ];

  /**
   * Renders MetaformVersions Listing
   *
   * @param metaform metaform
   */
  const renderVersionDataGrid = (metaform: Metaform) => {
    const versions = buildVersionRows(metaform);

    if (!versions) {
      return;
    }

    return (
      <DataGrid
        autoHeight
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
        rows={ versions }
        columns={ getColumns() }
        getRowId={ row => row.id }
      />
    );
  };

  /**
   * Renders metaform accordion
   *
   * @param metaform metaform
  */
  const renderMetaformAccordion = (metaform: Metaform) => (
    <Accordion
      key={ metaform.id }
      disableGutters
      sx={{ backgroundColor: "rgba(0,0,0,0.03)" }}
    >
      <AccordionSummary
        sx={{ backgroundColor: "white" }}
        expandIcon={ <KeyboardArrowDown style={{ fill: "darkgrey" }}/> }
      >
        <AdminFormTypographyField variant="h3">{ metaform.title }</AdminFormTypographyField>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        { renderVersionDataGrid(metaform) }
      </AccordionDetails>
    </Accordion>
  );

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

    const pageStart = pageSize * page;
    const pageEnd = pageSize * (page + 1);
    const pagedMetaforms = metaforms.slice(pageStart, pageEnd);

    return (
      <FormListContainer>
        <GenericLoaderWrapper loading={ loading }>
          <FormsContainer>
            { pagedMetaforms.map(renderMetaformAccordion) }
          </FormsContainer>
        </GenericLoaderWrapper>
        <Divider/>
        <FormPagination
          count={ metaforms.length }
          page={ page }
          onPageChange={ (_, newPage) => setPage(newPage) }
          rowsPerPage={ pageSize }
          onRowsPerPageChange={ ({ target: { value } }) => setPageSize(parseInt(value, 10)) }
        />
      </FormListContainer>
    );
  };

  return (
    <>
      { renderMetaformList() }
      { renderDeleteConfirm() }
    </>
  );
};

export default EditorScreenTable;