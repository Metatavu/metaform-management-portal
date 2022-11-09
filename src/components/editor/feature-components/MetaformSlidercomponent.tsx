import { Stack, TextField } from "@mui/material";
import { MetaformField, MetaformFieldType } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useState } from "react";
import { setMetaformField, selectMetaform } from "../../../features/metaform-slice";
import { useAppSelector, useAppDispatch } from "app/hooks";
/**
 * Component properties
 */
interface Props {
  setUpdatedMetaformField: (updatedMetaformField: MetaformField) => void;
}

/**
 * Draft editor right drawer feature define member group component
 */
const MetaformSliderComponent: FC<Props> = ({
  setUpdatedMetaformField
}) => {
  const dispatch = useAppDispatch();
  const { metaformSectionIndex, metaformFieldIndex, metaformField } = useAppSelector(selectMetaform);
  const [ debounceTimerId, setDebounceTimerId ] = useState<NodeJS.Timeout>();

  /**
   * Debounced update field
   *
   * @param field edited field
   * @param optionIndex option index
   */
  const updateFormFieldDebounced = (field: MetaformField) => {
    dispatch(setMetaformField(field));
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
    if (!metaformField || metaformSectionIndex === undefined || metaformFieldIndex === undefined) {
      return;
    }
    const field = metaformField;
    const updatedField = produce(metaformField, draftField => {
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
      { renderSliderProperties(metaformField) }
    </>
  );
};

export default MetaformSliderComponent;