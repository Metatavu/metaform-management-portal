import { Button, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { FieldRule, Metaform, MetaformField, MetaformTableColumn, MetaformTableColumnType } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useState } from "react";
import slugify from "slugify";
import DeleteIcon from "@mui/icons-material/Delete";
import MetaformUtils from "utils/metaform-utils";

/**
 * Component properties
 */
interface Props {
  selectedField?: MetaformField;
  setSelectedField: (selectedField?: MetaformField) => void;
  pendingForm: Metaform;
  sectionIndex?: number;
  fieldIndex?: number;
  debounceTimerId?: NodeJS.Timeout,
  setDebounceTimerId: (debounceTimerId: NodeJS.Timeout) => void;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Draft editor right drawer feature define member group component
 */
const MetaformTableComponent: FC<Props> = ({
  selectedField,
  setSelectedField,
  pendingForm,
  sectionIndex,
  fieldIndex,
  debounceTimerId,
  setDebounceTimerId,
  setPendingForm
}) => {
  const [ newColumnType, setNewColumnType ] = useState<MetaformTableColumnType>();

  /**
   * Updates field with visibility
   *
   * @param field edited field
   * @param optionIndex option index
   */
  const updateFormField = (field: MetaformField, optionIndex?: number) => {
    if (!selectedField || sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      if (MetaformUtils.fieldTypesAllowVisibility.includes(field.type)) {
        if ((selectedField.name !== undefined && field.name !== selectedField.name) || optionIndex !== undefined) {
          const fieldOptionMatch = optionIndex !== undefined ?
            pendingForm.sections![sectionIndex].fields![fieldIndex].options![optionIndex] :
            undefined;
          const fieldNameMatch = pendingForm.sections![sectionIndex].fields![fieldIndex].name || "";

          const fieldRules: FieldRule[] = [];

          draftForm.sections?.forEach(draftSection => {
            if (draftSection.visibleIf !== undefined) {
              MetaformUtils.fieldRuleScan(draftSection.visibleIf, fieldNameMatch, fieldRules, fieldOptionMatch);
            }
            draftSection.fields?.forEach(draftField => {
              if (draftField.visibleIf !== undefined) {
                MetaformUtils.fieldRuleScan(draftField.visibleIf, fieldNameMatch, fieldRules, fieldOptionMatch);
              }
            });
          });

          fieldRules.forEach(rule => {
            if ((selectedField.name !== undefined && field.name !== selectedField.name)) {
              rule.field = field.name;
            // option update
            } else if (optionIndex !== undefined) {
              const fieldOptionToUpdate = field.options![optionIndex];
              if (rule.equals === fieldOptionMatch!.name) {
                rule.equals = fieldOptionToUpdate.name;
              } else if (rule.notEquals === fieldOptionMatch!.name) {
                rule.notEquals = fieldOptionToUpdate.name;
              }
            }
          });
        }
      }

      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, field);
    });

    setPendingForm(updatedForm);
  };

  /**
   * Debounced update field
   *
   * @param field edited field
   * @param optionIndex option index
   */
  const updateFormFieldDebounced = (field: MetaformField, optionIndex?: number) => {
    setSelectedField(field);

    debounceTimerId && clearTimeout(debounceTimerId);
    setDebounceTimerId(setTimeout(() => updateFormField(field, optionIndex), 500));
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