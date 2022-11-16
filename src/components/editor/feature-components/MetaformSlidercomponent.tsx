import { Stack, TextField } from "@mui/material";
import { MetaformField } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC } from "react";
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
const MetaformSliderComponent: FC<Props> = ({
  updateFormFieldDebounced
}) => {
  const dispatch = useAppDispatch();
  const { metaformField } = useAppSelector(selectMetaform);

  /**
   * Update slider or number field min or max values. Number field can have empty min/max values but slider have to have min and max values
   *
   * @param eventValue Value of min or max value
   * @param scopeValue Min or Max, depending which value we are changing
   */
  const updateSliderOrNumberValue = (eventValue: number, scopeValue: string) => {
    if (!metaformField) {
      return;
    }
    const updatedField = produce(metaformField, draftField => {
      if (scopeValue === "min") {
        draftField.min = Number(eventValue);
      }
      if (scopeValue === "max") {
        draftField.max = Number(eventValue);
      }
    });
    dispatch(setMetaformField(updatedField));
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