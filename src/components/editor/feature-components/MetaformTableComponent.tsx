import { Button, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { MetaformField, MetaformTableColumn, MetaformTableColumnType } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC } from "react";
import slugify from "slugify";
import DeleteIcon from "@mui/icons-material/Delete";
import { setMetaformField, selectMetaform } from "../../../features/metaform-slice";
import { useAppSelector, useAppDispatch } from "app/hooks";
/**
 * Component properties
 */
interface Props {
  updateFormFieldDebounced: (updatedField: MetaformField) => void;
}

/**
 * Draft editor right drawer feature define member group component
 */
const MetaformTableComponent: FC<Props> = ({
  updateFormFieldDebounced
}) => {
  const [ newColumnType, setNewColumnType ] = React.useState<MetaformTableColumnType>();
  const { metaformField } = useAppSelector(selectMetaform);
  const dispatch = useAppDispatch();

  /**
   * Update column value
   *
   * @param tableColumn Metaform table column where we are changing title
   * @param columnIndex index value of current column title
   */
  const updateTableColumn = (tableColumn: MetaformTableColumn, columnIndex: number) => {
    if (!metaformField) {
      return;
    }

    const updatedField = produce(metaformField, draftField => {
      draftField.columns?.splice(columnIndex, 1, tableColumn);
    });
    dispatch(setMetaformField(updatedField));
    updateFormFieldDebounced(updatedField);
  };
  
  /**
   * Delete column
   *
   * @param columnIndex index value of current column we are deleting
   */
  const deleteColumn = (columnIndex: number) => {
    if (!metaformField) {
      return;
    }

    const updatedField = produce(metaformField, draftField => {
      draftField.columns?.splice(columnIndex, 1);
    });
    dispatch(setMetaformField(updatedField));
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
    if (!metaformField) {
      return;
    }

    const columnsAmount = metaformField.columns?.length || 0;

    const newColumn: MetaformTableColumn = {
      type: newColumnType!,
      name: columnsAmount.toString(),
      title: columnsAmount.toString()
    };

    const updatedField = produce(metaformField, draftField => {
      draftField.columns = [ ...(draftField.columns || []), newColumn ];
    });
    dispatch(setMetaformField(updatedField));
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
    const field2 = field;
    if (field2) {
      return (
        <Stack spacing={ 2 }>
          { field2.columns?.map(renderTableColumnEdit) }
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
      { renderTableProperties(metaformField) }
    </>
  );
};

export default MetaformTableComponent;