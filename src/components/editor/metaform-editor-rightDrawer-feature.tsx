import { Checkbox, Divider, FormControl, FormControlLabel, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformSection } from "generated/client";
import produce from "immer";
import slugify from "slugify";
import strings from "localization/strings";
import React, { useEffect, FC } from "react";

/**
 * Component properties
 */
interface Props {
  sectionIndex?: number;
  fieldIndex?: number;
  pendingForm: Metaform;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Draft editor right drawer feature component
 */
const MetaformEditorRightDrawerFeatureComponent: FC<Props> = ({
  sectionIndex,
  fieldIndex,
  pendingForm,
  setPendingForm
}) => {
  const [ metaformSectionTitle, setMetaFormSectionTitle] = React.useState<string | undefined>("");

  /**
   * Set values of Confidition field, switch and get selected component name
   */
  const setVisiblityComponentValues = () => {
    if (fieldIndex === undefined && sectionIndex !== undefined) {
      setMetaFormSectionTitle(pendingForm.sections![sectionIndex].title ?? "");
    }
  };

  useEffect(() => {
    setVisiblityComponentValues();
  }, [fieldIndex, sectionIndex]);

  /**
   * Updates metaform field
   *
   * @param newMetaformField new metaform field
   */
  const updateFormField = (newMetaformField: MetaformField) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, newMetaformField);
    });
    setPendingForm(updatedForm);
  };

  /**
   * Updates metaform section
   *
   * @param newMetaformSection new metaform section
   */
  const updateFormSection = (newMetaformSection: MetaformSection) => {
    if (sectionIndex === undefined) {
      return;
    }

    const section = pendingForm.sections?.[sectionIndex];
    if (!section) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.splice(sectionIndex, 1, newMetaformSection);
    });

    setPendingForm(updatedForm);
  };

  /**
  * Renders fields category title
  * 
  * @param title Category title
  */
  const renderFieldsCategoryTitle = (title: string) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }

    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      return (
        <Typography variant="subtitle1" style={{ width: "100%" }}>
          { title }
        </Typography>
      );
    }
  };

  /**
   * Render feature component
   */
  const renderFeatures = () => {
    if (sectionIndex === undefined && fieldIndex === undefined) {
      return (
        <Typography>{ strings.draftEditorScreen.editor.visibility.selectVisibilityInfo }</Typography>
      );
    }

    if (sectionIndex !== undefined && fieldIndex === undefined) {
      const section = pendingForm.sections![sectionIndex];
      return (
        <TextField
          fullWidth
          value={ section.title }
          label={ strings.draftEditorScreen.editor.features.sectionTitle }
          onChange={ event => updateFormSection({
            ...section,
            title: event.target.value
          }) }
        />
      );
    }

    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const field = pendingForm.sections![sectionIndex].fields![fieldIndex];
      if (!field) {
        return null;
      }
      const disableForm = field.type === "select" || field.type === "date-time" || field.type === "radio" || field.type === "checklist" || field.type === "date";

      return (
        <>
          { renderFieldsCategoryTitle(strings.draftEditorScreen.editor.features.fieldDatas) }
          <TextField
            fullWidth
            label={ strings.draftEditorScreen.editor.features.fieldTitle }
            value={ field.title ? field.title : "" }
            onChange={ event => updateFormField({
              ...field,
              title: event.target.value,
              name: slugify(metaformSectionTitle + event.target.value)
            }) }
          />

          <Divider/>
          { renderFieldsCategoryTitle(strings.draftEditorScreen.editor.features.required) }
          <FormControlLabel
            label={ strings.generic.yes }
            control={
              <Checkbox
                checked={ field.required }
                onChange={ event => updateFormField({ ...field, required: event.target.checked }) }
              />
            }
          />
          <Divider/>
          <Typography variant="subtitle1" style={{ width: "100%" }}>
            { strings.draftEditorScreen.editor.features.defineUserGroup }
          </Typography>

          <FormControl disabled={ !disableForm }>
            <FormControlLabel
              label={ strings.generic.yes }
              control={
                <Checkbox
                  checked
                />
              }
            />
            <Typography fontSize="12px">
              { strings.draftEditorScreen.editor.features.selectableFieldsInfo }
            </Typography>
          </FormControl>
        </>
      );
    }
  };

  /**
   * Component render
   */
  return (
    <>
      { renderFeatures() }
    </>
  );
};

export default MetaformEditorRightDrawerFeatureComponent;