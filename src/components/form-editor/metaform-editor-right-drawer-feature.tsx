import { Stack, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformSection, MetaformFieldType, FieldRule, MetaformMemberGroup, MetaformFieldOption } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useEffect, useState } from "react";
import MetaformUtils from "utils/metaform-utils";
import MetaformDefineMemberGroupComponent from "./feature-components/MetaformDefineMemberGroupComponent";
import MetaformSliderComponent from "./feature-components/MetaformSlidercomponent";
import MetaformTableComponent from "./feature-components/MetaformTableComponent";
import MetaformDateTimeComponent from "./feature-components/MetaformDateTimeComponent";
import MetaformMultiChoiceFieldPropertiesComponent from "./feature-components/MetaformMultiChoiceFieldPropertiesComponent";
import MetaformContextOptionsComponent from "./feature-components/MetaformContextOptionsComponent";
import MetaformFieldAndSubmitEditTitleComponent from "./feature-components/MetaformFieldAndSubmitTitleEditComponent";
import MetaformFieldRequiredComponent from "./feature-components/MetaformFieldRequiredComponent";
import { selectMetaform } from "../../features/metaform-slice";
import { useAppSelector } from "app/hooks";
import MetaformFieldClassifiersComponent from "./feature-components/MetaformFieldClassifiersComponent";
import Feature from "components/containers/feature";
import { FeatureStrategy, FeatureType } from "types";
import { DrawerSection } from "styled/editor/metaform-editor";

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
  const { metaformFieldIndex, metaformSectionIndex } = useAppSelector(selectMetaform);
  const [ debounceTimerId, setDebounceTimerId ] = useState<NodeJS.Timeout>();
  const [ metaformField, setMetaformField ] = useState<MetaformField>();
  const [ metaformSection, setMetaformSection ] = useState<MetaformSection>();

  useEffect(() => {
    if (metaformSectionIndex !== undefined) {
      setMetaformSection(pendingForm.sections?.[metaformSectionIndex]);
    }
    if (metaformFieldIndex !== undefined && metaformSectionIndex !== undefined) {
      setMetaformField(pendingForm.sections?.[metaformSectionIndex].fields?.[metaformFieldIndex]);
    }
    if (metaformFieldIndex === undefined) {
      setMetaformField(undefined);
    }
    if (metaformSectionIndex === undefined) {
      setMetaformSection(undefined);
    }
  }, [pendingForm, metaformSectionIndex, metaformFieldIndex]);
  
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
    setMetaformSection(selectedMetaformSection);
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
          <DrawerSection>
            <Typography variant="subtitle1" style={{ width: "100%" }}>
              { strings.draftEditorScreen.editor.features.field.fieldProperties }
            </Typography>
            <MetaformSliderComponent
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
          </DrawerSection>
        );
      case MetaformFieldType.Checklist:
      case MetaformFieldType.Radio:
      case MetaformFieldType.Select:
        return (
          <>
            <DrawerSection>
              <Typography variant="subtitle1" style={{ width: "100%" }}>
                { strings.draftEditorScreen.editor.features.field.fieldProperties }
              </Typography>
              <MetaformMultiChoiceFieldPropertiesComponent
                updateFormFieldDebounced={ updateFormFieldDebounced }
              />
            </DrawerSection>
            <DrawerSection>
              <MetaformDefineMemberGroupComponent
                memberGroups={ memberGroups }
                updateFormFieldDebounced={ updateFormFieldDebounced }
              />
            </DrawerSection>
          </>
        );
      case MetaformFieldType.Table:
        return (
          <DrawerSection>
            <Typography variant="subtitle1" style={{ width: "100%" }}>
              { strings.draftEditorScreen.editor.features.field.fieldProperties }
            </Typography>
            <MetaformTableComponent
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
          </DrawerSection>
        );
      case MetaformFieldType.Date:
      case MetaformFieldType.DateTime:
        return (
          <DrawerSection>
            <Typography variant="subtitle1" style={{ width: "100%" }}>
              { strings.draftEditorScreen.editor.features.field.fieldProperties }
            </Typography>
            <MetaformDateTimeComponent
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
          </DrawerSection>
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
    <DrawerSection>
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
    </DrawerSection>
  );

  /**
   * Renders field editor
   *
   * @param field field
   */
  const renderFieldEditor = (field: MetaformField) => (
    <>
      <DrawerSection>
        <MetaformFieldAndSubmitEditTitleComponent
          updateFormFieldDebounced={ updateFormFieldDebounced }
        />
        <MetaformFieldRequiredComponent
          updateFormFieldDebounced={ updateFormFieldDebounced }
        />
      </DrawerSection>
      { renderFieldProperties(field) }
      <MetaformContextOptionsComponent
        updateFormFieldDebounced={ updateFormFieldDebounced }
      />
      <Feature feature={ FeatureType.FORM_SCRIPTS } strategy={ FeatureStrategy.HIDE } >
        <DrawerSection>
          <MetaformFieldClassifiersComponent
            updateFormFieldDebounced={ updateFormFieldDebounced }
          />
        </DrawerSection>
      </Feature>
    </>
  );

  /**
   * Renders empty selection
   */
  const renderEmptySelection = () => (
    <DrawerSection>
      <Typography>{ strings.draftEditorScreen.editor.emptySelection}</Typography>
    </DrawerSection>
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