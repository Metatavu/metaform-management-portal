import { Divider, Stack, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformSection, MetaformFieldType, FieldRule, MetaformMemberGroup, MetaformFieldOption } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useState } from "react";
import MetaformUtils from "utils/metaform-utils";
import MetaformDefineMemberGroupComponent from "./feature-components/MetaformDefineMemberGroupComponent";
import MetaformSliderComponent from "./feature-components/MetaformSlidercomponent";
import MetaformTableComponent from "./feature-components/MetaformTableComponent";
import MetaformDateTimeComponent from "./feature-components/MetaformDateTimeComponent";
import MetaformMultiChoiceFieldPropertiesComponent from "./feature-components/MetaformMultiChoiceFieldPropertiesComponent";
import MetaformContextOptionsComponent from "./feature-components/MetaformContextOptionsComponent";
import MetaformFieldAndSubmitEditTitleComponent from "./feature-components/MetaformFieldAndSubmitTitleEditComponent";
import MetaformFieldRequiredComponent from "./feature-components/MetaformFieldRequiredComponent";
import { selectMetaform, setMetaformSection } from "../../features/metaform-slice";
import { useAppSelector, useAppDispatch } from "app/hooks";

/**
 * Component properties
 */
interface Props {
  memberGroups: MetaformMemberGroup[],
  pendingForm: Metaform;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Draft editor right drawer feature component
 */
export const MetaformEditorRightDrawerFeature: FC<Props> = ({
  memberGroups,
  pendingForm,
  setPendingForm
}) => {
  const { metaformField, metaformFieldIndex, metaformSectionIndex, metaformSection } = useAppSelector(selectMetaform);
  const [ debounceTimerId, setDebounceTimerId ] = useState<NodeJS.Timeout>();
  const dispatch = useAppDispatch();

  /**
   * 
   * @param fieldRules field rules
   * @param field metaform field
   * @param optionIndex option index
   * @param fieldOptionMatch field option match
   */
  const checkFieldRules = (fieldRules: FieldRule[], field: MetaformField, optionIndex?: number, fieldOptionMatch?: MetaformFieldOption) => {
    fieldRules.forEach(rule => {
      if ((metaformField!.name !== undefined && field.name !== metaformField!.name)) {
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
      return field;
    });
  };
  
  /**
   * Updates field with visibility
   *
   * @param field edited field
   * @param optionIndex option index
   */
  const updateFormField = (field: MetaformField, optionIndex?: number) => {
    if (!metaformField || metaformSectionIndex === undefined || metaformFieldIndex === undefined) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      if (MetaformUtils.fieldTypesAllowVisibility.includes(field.type)) {
        const checkedName = pendingForm.sections![metaformSectionIndex!].fields![metaformFieldIndex!];
        if ((checkedName!.name !== undefined && field.name !== checkedName!.name) || optionIndex !== undefined) {
          const fieldOptionMatch = optionIndex !== undefined ?
            pendingForm.sections![metaformSectionIndex].fields![metaformFieldIndex].options![optionIndex] :
            undefined;
          const fieldNameMatch = pendingForm.sections![metaformSectionIndex].fields![metaformFieldIndex].name || "";

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
          checkFieldRules(fieldRules, field, optionIndex, fieldOptionMatch);
        }
      }

      draftForm.sections?.[metaformSectionIndex]?.fields?.splice(metaformFieldIndex, 1, field);
    });

    setPendingForm(updatedForm);
  };

  /**
   * Debounced update field
   *
   * @param field edited field
   */
  const updateFormFieldDebounced = (field: MetaformField, optionIndex?: number) => {
    debounceTimerId && clearTimeout(debounceTimerId);
    setDebounceTimerId(setTimeout(() => updateFormField(field, optionIndex), 500));
  };

  /**
   * Updates metaform section
   *
   * @param metaformSection metaform section what we are editing
   */
  const updateFormSection = (selectedMetaformSection: MetaformSection) => {
    if (metaformSectionIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.splice(metaformSectionIndex, 1, selectedMetaformSection);
    });
    dispatch(setMetaformSection(selectedMetaformSection));
    setPendingForm(updatedForm);
  };

  /**
   * Renders field properties
   *
   * @param field field
   */
  const renderFieldProperties = (field: MetaformField) => {
    const { type } = field;

    switch (type) {
      case MetaformFieldType.Slider:
      case MetaformFieldType.Number:
        return (
          <>
            <MetaformSliderComponent
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
            <Divider/>
          </>
        );
      case MetaformFieldType.Checklist:
      case MetaformFieldType.Radio:
      case MetaformFieldType.Select:
        return (
          <>
            <MetaformMultiChoiceFieldPropertiesComponent
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
            <Divider/>
            <MetaformDefineMemberGroupComponent
              memberGroups={ memberGroups }
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
            <Divider/>
          </>
        );
      case MetaformFieldType.Table:
        return (
          <>
            <MetaformTableComponent
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
            <Divider/>
          </>
        );
      case MetaformFieldType.Date:
      case MetaformFieldType.DateTime:
        return (
          <>
            <MetaformDateTimeComponent
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
            <Divider/>
          </>
        );
      default:
        break;
    }
  };

  /**
   * Renders section editor
   *
   * @param section section
   */
  const renderSectionEditor = (section: MetaformSection) => (
    <>
      <Typography variant="subtitle1" style={{ width: "100%" }}>
        { strings.draftEditorScreen.editor.features.section.sectionData }
      </Typography>
      <TextField
        fullWidth
        value={ section.title ?? "" }
        label={ strings.draftEditorScreen.editor.features.section.sectionTitle }
        onChange={ event => updateFormSection({
          ...section,
          title: event.target.value
        }) }
      />
    </>
  );

  /**
   * Renders field editor
   *
   * @param field field
   */
  const renderFieldEditor = (field: MetaformField) => (
    <>
      <MetaformFieldAndSubmitEditTitleComponent
        updateFormFieldDebounced={ updateFormFieldDebounced }
      />
      <Divider/>
      { renderFieldProperties(field) }
      <MetaformContextOptionsComponent
        updateFormFieldDebounced={ updateFormFieldDebounced }
      />
      <Divider/>
      <MetaformFieldRequiredComponent
        updateFormFieldDebounced={ updateFormFieldDebounced }
      />
      <Divider/>
    </>
  );

  /**
   * Renders empty selection
   */
  const renderEmptySelection = () => (
    <Typography>{ strings.draftEditorScreen.editor.emptySelection}</Typography>
  );

  /**
   * Renders feature editor
   */
  const renderFeatureEditor = () => {
    if (metaformField && metaformSection) {
      return renderFieldEditor(metaformField);
    }

    if (metaformSection) {
      return renderSectionEditor(metaformSection);
    }

    return renderEmptySelection();
  };

  /**
   * Component render
   */
  return (
    <Stack
      spacing={ 2 }
      width="100%"
      overflow="hidden"
    >
      { renderFeatureEditor() }
    </Stack>
  );
};

export default MetaformEditorRightDrawerFeature;