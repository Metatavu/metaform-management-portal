import { FormControlLabel, Stack, Switch } from "@mui/material";
import { MetaformField } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC } from "react";

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
const MetaformDateTimeComponent: FC<Props> = ({
  selectedField,
  setSelectedField,
  debounceTimerId,
  setDebounceTimerId,
  setUpdatedMetaformField
}) => {
  /**
   * Debounced update field
   *
   * @param field edited field
   * @param optionIndex option index
   */
  const updateFormFieldDebounced = (field: MetaformField) => {
    setSelectedField(field);

    debounceTimerId && clearTimeout(debounceTimerId);
    setDebounceTimerId(setTimeout(() => setUpdatedMetaformField(field), 500));
  };

  /**
   * Updates allows work days only for date, date-time field
   *
   * @param checked checked value of the checkbox value true or false
   */
  const updateWorkDaysOnly = (checked: boolean) => {
    if (!selectedField) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      draftField.workdaysOnly = checked;
    });

    updateFormFieldDebounced(updatedField);
  };

  /**
   * Renders properties for date, date-time fields
   *
   * @param field field
   */
  const renderDateTimeProperties = (field?: MetaformField) => {
    if (field) {
      return (
        <Stack spacing={ 2 }>
          <FormControlLabel
            label={ strings.draftEditorScreen.editor.features.field.workDaysOnly }
            control={
              <Switch
                checked={ !!field.workdaysOnly }
                onChange={ ({ target }) => updateWorkDaysOnly(target.checked) }
              />
            }
          />
        </Stack>
      );
    }
  };

  /**
   * Component render
   */
  return (
    <>
      { renderDateTimeProperties(selectedField) }
    </>
  );
};

export default MetaformDateTimeComponent;