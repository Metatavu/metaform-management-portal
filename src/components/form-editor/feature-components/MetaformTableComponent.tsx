import { FormControlLabel, IconButton, MenuItem, Stack, Switch, TextField } from "@mui/material";
import { MetaformField, MetaformTableColumn, MetaformTableColumnType } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { selectMetaform } from "../../../features/metaform-slice";
import { useAppSelector } from "app/hooks";
import MetaformUtils from "utils/metaform-utils";
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
  const [ newColumnCalculateSum, setNewColumnCalculateSum ] = React.useState<boolean>();
  const [ newColumnSumPostfix, setNewColumnSumPostfix ] = React.useState<string>();
  const { metaformVersion, metaformFieldIndex, metaformSectionIndex } = useAppSelector(selectMetaform);
  const pendingForm = MetaformUtils.jsonToMetaform(MetaformUtils.getDraftForm(metaformVersion));
  const [ metaformField, setMetaformField ] = React.useState<MetaformField>();

  useEffect(() => {
    if (metaformSectionIndex !== undefined && metaformFieldIndex !== undefined) {
      setMetaformField(pendingForm.sections?.[metaformSectionIndex].fields?.[metaformFieldIndex]);
    }
  }, [metaformFieldIndex, metaformSectionIndex, metaformVersion]);

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
      draftField.table?.columns?.splice(columnIndex, 1, tableColumn);
    });
    setMetaformField(updatedField);
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
      draftField.table?.columns?.splice(columnIndex, 1);
    });
    setMetaformField(updatedField);
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
      spacing={ 0 }
      direction="row"
    >
      <TextField
        fullWidth
        value={ column.title }
        onChange={ event => updateTableColumn({
          ...column,
          title: event.target.value,
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

    const columnsAmount = metaformField.table?.columns?.length || 0;

    const newColumn: MetaformTableColumn = {
      type: newColumnType!,
      name: columnsAmount.toString(),
      title: columnsAmount.toString(),
      calculateSum: newColumnCalculateSum,
      sumPostfix: newColumnSumPostfix
    };

    const updatedField = produce(metaformField, draftField => {
      if (draftField.table) {
        draftField.table.columns = [ ...(draftField.table.columns || []), newColumn ];
      }
    });
    setMetaformField(updatedField);
    updateFormFieldDebounced(updatedField);
  };

  /**
   * Render column sum options
   */
  const renderColumnSumOptions = () => (
    <>
      <FormControlLabel
        label={ strings.draftEditorScreen.editor.features.field.calculateColumnSum }
        control={
          <Switch
            checked={ newColumnCalculateSum }
            onChange={ ({ target }) => setNewColumnCalculateSum(target.checked) }
          />
        }
      />
      { newColumnCalculateSum &&
        <TextField
          label={ strings.draftEditorScreen.editor.features.field.sumPostfix }
          value={ newColumnSumPostfix }
          onChange={ ({ target }) => setNewColumnSumPostfix(target.value) }
        />
      }
    </>
  );

  /**
   * Renders table new column
   */
  const renderTableNewColumn = () => (
    <Stack
      spacing={ 0 }
      direction="row"
    >
      <Stack flex={ 1 }>
        <TextField
          select
          fullWidth
          label={ strings.draftEditorScreen.editor.features.field.addNewColumn }
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
        {
          newColumnType === MetaformTableColumnType.Number && renderColumnSumOptions()
        }
      </Stack>
      <IconButton
        disabled={ newColumnType === undefined }
        onClick={ addNewColumn }
        color="success"
        sx={{ alignSelf: "flex-start" }}
      >
        <AddCircleIcon/>
      </IconButton>
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
          { field2.table?.columns?.map(renderTableColumnEdit) }
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