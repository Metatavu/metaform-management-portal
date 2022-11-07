import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { MetaformField } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC } from "react";
import { FormContext } from "types";
import LocalizationUtils from "utils/localization-utils";

/**
 * Component properties
 */
interface Props {
  setUpdatedMetaformField: (updatedMetaformField: MetaformField) => void;
  selectedField?: MetaformField;
  setSelectedField: (selectedField?: MetaformField) => void;
  debounceTimerId?: NodeJS.Timeout,
  setDebounceTimerId: (debounceTimerId: NodeJS.Timeout) => void;
}

/**
 * Draft editor right drawer feature define member group component
 */
const MetaformContextOptionsComponent: FC<Props> = ({
  setUpdatedMetaformField,
  selectedField,
  setSelectedField,
  debounceTimerId,
  setDebounceTimerId
}) => {
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
   * Update contexts of field
   *
   * @param selectedContext Selected context Option
   * @param checked Is context option checked or not
   */
  const updateContexts = (selectedContext: FormContext, checked: boolean) => {
    if (!selectedField) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      let updatedContexts: string[] = [ ...(draftField.contexts || []) ];
      if (checked) {
        updatedContexts.push(selectedContext);
      } else {
        updatedContexts = updatedContexts.filter(context => context !== selectedContext);
      }

      draftField.contexts = updatedContexts;
    });

    updateFormFieldDebounced(updatedField);
  };

  /**
   * Renders context option
   *
   * @param context context
   * @param selectedContexts selected contexts
   */
  const renderContextOption = (context: FormContext, selectedContexts: string[]) => {
    if (context !== FormContext.META) {
      return (
        <FormControlLabel
          key={ context.toString() }
          label={ LocalizationUtils.getLocalizedFormContext(context) }
          control={
            <Checkbox
              checked={ selectedContexts.includes(context) }
              onChange={ event => updateContexts(context, event.target.checked) }
            />
          }
        />
      );
    }
  };

  /**
   * Renders contexts options
   *
   * @param field field
   */
  const renderContextOptions = (field?: MetaformField) => {
    if (field) {
      return (
        <Stack spacing={ 2 }>
          <Typography variant="subtitle1">
            { strings.draftEditorScreen.editor.features.field.contextVisibilityInfo }
          </Typography>
          { Object.values(FormContext).map(context => renderContextOption(context, field.contexts || [])) }
        </Stack>
      );
    }
  };

  /**
   * Component render
   */
  return (
    <>
      { renderContextOptions(selectedField) }
    </>
  );
};

export default MetaformContextOptionsComponent;