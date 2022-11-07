import { Button, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { MetaformField, MetaformTableColumn, MetaformTableColumnType } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useState } from "react";
import slugify from "slugify";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Component properties
 */
interface Props {
  selectedField?: MetaformField;
  setSelectedField: (selectedField?: MetaformField) => void;
  debounceTimerId?: NodeJS.Timeout,
  setDebounceTimerId: (debounceTimerId: NodeJS.Timeout) => void;
  setUpdatedMetaformField: (updatedMetaformField: MetaformField) => void;
}

/**
 * Draft editor right drawer feature define member group component
 */
const MetaformTableComponent: FC<Props> = ({
  selectedField,
  setSelectedField,
  debounceTimerId,
  setDebounceTimerId,
  setUpdatedMetaformField
}) => {
  const [ newColumnType, setNewColumnType ] = useState<MetaformTableColumnType>();

  /**
   * Debounced update field
   *
   * @param field edited field
   */
  const updateFormFieldDebounced = (field: MetaformField) => {
    setSelectedField(field);

    debounceTimerId && clearTimeout(debounceTimerId);
    setDebounceTimerId(setTimeout(() => setUpdatedMetaformField(field), 500));
  };

  /**
   * Update column value
   *
   * @param tableColumn Metaform table column where we are changing title
   * @param columnIndex index value of current column title
   */
  const updateTableColumn = (tableColumn: MetaformTableColumn, columnIndex: number) => {
    if (!selectedField) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      draftField.columns?.splice(columnIndex, 1, tableColumn);
    });

    updateFormFieldDebounced(updatedField);
  };
  
  /**
   * Delete column
   *
   * @param columnIndex index value of current column we are deleting
   */
  const deleteColumn = (columnIndex: number) => {
    if (!selectedField) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      draftField.columns?.splice(columnIndex, 1);
    });

    updateFormFieldDebounced(updatedField);
  };

  /**
   * Renders table column edit
   *
   * @param column column
   * @param index index
   */
  const renderTableColumnEdit = (column: MetaformTableColumn, index: number) => (
    <Stack
      key={ `column-${index}` }
      spacing={ 2 }
      direction="row"
    >
      <TextField
        value={ column.title }
        label={ index }
        onChange={ event => updateTableColumn({
          ...column,
          name: slugify(`${event.target.value}-${index}`),
          title: event.target.value,
          type: "text" as MetaformTableColumnType,
          values: undefined
        }, index)}
      />
      <IconButton
        color="error"
        value={ index }
        onClick={ () => deleteColumn(index) }
      >
        <DeleteIcon color="error"/>
      </IconButton>
    </Stack>
  );

  /**
   * Add new column in table
   */
  const addNewColumn = () => {
    if (!selectedField) {
      return;
    }

    const columnsAmount = selectedField.columns?.length || 0;

    const newColumn: MetaformTableColumn = {
      type: newColumnType!,
      name: columnsAmount.toString(),
      title: columnsAmount.toString()
    };

    const updatedField = produce(selectedField, draftField => {
      draftField.columns = [ ...(draftField.columns || []), newColumn ];
    });

    updateFormFieldDebounced(updatedField);
  };

  /**
   * Renders table new column
   */
  const renderTableNewColumn = () => (
    <Stack spacing={ 2 }>
      <Typography variant="subtitle1" style={{ width: "100%" }}>
        { strings.draftEditorScreen.editor.features.field.addNewColumn }
      </Typography>
      <TextField
        select
        fullWidth
        label={ strings.draftEditorScreen.editor.features.field.addColumnType }
        value={ newColumnType }
        onChange={ ({ target }) => setNewColumnType(target.value as MetaformTableColumnType) }
      >
        <MenuItem value={ MetaformTableColumnType.Text }>
          { strings.draftEditorScreen.editor.features.field.columnTextType }
        </MenuItem>
        <MenuItem value={ MetaformTableColumnType.Number }>
          { strings.draftEditorScreen.editor.features.field.columnNumberType }
        </MenuItem>
      </TextField>
      <Button
        fullWidth
        disabled={ newColumnType === undefined }
        onClick={ addNewColumn }
      >
        { strings.draftEditorScreen.editor.features.field.addNewColumn }
      </Button>
    </Stack>
  );
  
  /**
   * Renders features for adding, editing and deleting columns in table field
   *
   * @param field field
   */
  const renderTableProperties = (field?: MetaformField) => {
    if (field) {
      return (
        <Stack spacing={ 2 }>
          { field.columns?.map(renderTableColumnEdit) }
          { renderTableNewColumn() }
        </Stack>
      );
    }
  };

  /**
   * Component render
   */
  return (
    <>
      { renderTableProperties(selectedField) }
    </>
  );
};

export default MetaformTableComponent;