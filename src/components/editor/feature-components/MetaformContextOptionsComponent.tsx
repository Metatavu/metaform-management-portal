import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { MetaformField } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useState } from "react";
import { FormContext } from "types";
import LocalizationUtils from "utils/localization-utils";
import { selectMetaform, setMetaformField } from "../../../features/metaform-slice";
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
const MetaformContextOptionsComponent: FC<Props> = ({
  setUpdatedMetaformField
}) => {
  const [ debounceTimerId, setDebounceTimerId ] = useState<NodeJS.Timeout>();
  const { metaformField } = useAppSelector(selectMetaform);
  const dispatch = useAppDispatch();

  /**
   * Debounced update field
   *
   * @param field edited field
   */
  const updateFormFieldDebounced = (field: MetaformField) => {
    dispatch(setMetaformField(field));
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
    if (!metaformField) {
      return;
    }

    const updatedField = produce(metaformField, draftField => {
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
      { renderContextOptions(metaformField) }
    </>
  );
};

export default MetaformContextOptionsComponent;