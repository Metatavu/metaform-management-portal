import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { MetaformField } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useEffect } from "react";
import { FormContext } from "types";
import LocalizationUtils from "utils/localization-utils";
import { selectMetaform } from "../../../features/metaform-slice";
import { useAppSelector } from "app/hooks";
import MetaformUtils from "utils/metaform-utils";
import { DrawerSection } from "styled/editor/metaform-editor";

/**
 * Component properties
 */
interface Props {
  updateFormFieldDebounced: (updatedField: MetaformField) => void;
}

/**
 * Draft editor right drawer feature define member group component
 */
const MetaformContextOptionsComponent: FC<Props> = ({
  updateFormFieldDebounced
}) => {
  const { metaformVersion, metaformFieldIndex, metaformSectionIndex } = useAppSelector(selectMetaform);
  const pendingForm = MetaformUtils.jsonToMetaform(MetaformUtils.getDraftForm(metaformVersion));
  const [ metaformField, setMetaformField ] = React.useState<MetaformField>();

  useEffect(() => {
    if (metaformSectionIndex !== undefined && metaformFieldIndex !== undefined) {
      setMetaformField(pendingForm.sections?.[metaformSectionIndex].fields?.[metaformFieldIndex]);
    }
  }, [metaformFieldIndex, metaformSectionIndex, metaformVersion]);
  
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
    setMetaformField(updatedField);
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
        <DrawerSection>
          <Typography variant="subtitle1">
            { strings.draftEditorScreen.editor.features.field.contextVisibilityInfo }
          </Typography>
          { Object.values(FormContext).map(context => renderContextOption(context, field.contexts || [])) }
        </DrawerSection>
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