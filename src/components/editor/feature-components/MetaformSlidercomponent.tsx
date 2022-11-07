import { Stack, TextField } from "@mui/material";
import { Metaform, MetaformField, MetaformFieldType } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC } from "react";

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
  setUpdatedMetaformField: (updatedMetaformField: MetaformField) => void;
}

/**
 * Draft editor right drawer feature define member group component
 */
const MetaformSliderComponent: FC<Props> = ({
  selectedField,
  setSelectedField,
  pendingForm,
  sectionIndex,
  fieldIndex,
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
   * Update slider or number field min or max values. Number field can have empty min/max values but slider have to have min and max values
   *
   * @param eventValue Value of min or max value
   * @param scopeValue Min or Max, depending which value we are changing
   */
  const updateSliderOrNumberValue = (eventValue: number, scopeValue: string) => {
    if (!selectedField) {
      return;
    }
    const field = pendingForm.sections![sectionIndex!].fields![fieldIndex!];
    const updatedField = produce(selectedField, draftField => {
      if (scopeValue === "min") {
        if (!eventValue && field.type === MetaformFieldType.Number) {
          draftField.min = undefined;
        } else {
          draftField.min = Number(eventValue);
        }
      }
      if (scopeValue === "max") {
        if (!eventValue) {
          if (field.type === MetaformFieldType.Number) {
            draftField.max = undefined;
          } else {
            draftField.max = field.min! + 1;
          }
        } else {
          draftField.max = Number(eventValue);
        }
      }
    });
    updateFormFieldDebounced(updatedField);
  };

  /**
   * Renders slider scope values
   *
   * @param field field
   */
  const renderSliderProperties = (field?: MetaformField) => {
    if (field) {
      const { max, min } = field;
      const { minValueLabel, maxValueLabel } = strings.draftEditorScreen.editor.features.field.slider;

      return (
        <Stack spacing={ 2 }>
          <TextField
            fullWidth
            type="number"
            label={ minValueLabel }
            value={ min !== undefined ? min : "" }
            onChange={ event => updateSliderOrNumberValue(Number(event.target.value), "min") }
          />
          <TextField
            fullWidth
            type="number"
            label={ maxValueLabel }
            value={ max !== undefined ? max : "" }
            onChange={ event => updateSliderOrNumberValue(Number(event.target.value), "max") }
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
      { renderSliderProperties(selectedField) }
    </>
  );
};

export default MetaformSliderComponent;