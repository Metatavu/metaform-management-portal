import { Divider, Stack, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformSection, MetaformFieldType, FieldRule, MetaformMemberGroup } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { useEffect, FC, useState } from "react";
import MetaformUtils from "utils/metaform-utils";
import MetaformDefineMemberGroupComponent from "./feature-components/MetaformDefineMemberGroupComponent";
import MetaformSliderComponent from "./feature-components/MetaformSlidercomponent";
import MetaformTableComponent from "./feature-components/MetaformTableComponent";
import MetaformDateTimeComponent from "./feature-components/MetaformDateTimeComponent";
import MetaformMultiChoiceFieldPropertiesComponent from "./feature-components/MetaformMultiChoiceFieldPropertiesComponent";
import MetaformContextOptionsComponent from "./feature-components/MetaformContextOptionsComponent";
import MetaformFieldAndSubmitEditTitleComponent from "./feature-components/MetaformFieldAndSubmitTitleEditComponent";
import MetaformFieldRequiredComponent from "./feature-components/MetaformFieldRequiredComponent";
import { selectMetaform, setMetaformField, setMetaformFieldIndex, setMetaformSectionIndex, setMetaformSection } from "../../features/metaform-slice";
import { useAppSelector, useAppDispatch } from "app/hooks";

/**
 * Component properties
 */
interface Props {
  memberGroups: MetaformMemberGroup[],
  sectionIndex?: number;
  fieldIndex?: number;
  pendingForm: Metaform;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Draft editor right drawer feature component
 */
export const MetaformEditorRightDrawerFeature: FC<Props> = ({
  memberGroups,
  sectionIndex,
  fieldIndex,
  pendingForm,
  setPendingForm
}) => {
  const [ updatedMetaformField, setUpdatedMetaformField ] = useState<MetaformField>();
  const { metaformField, metaformFieldIndex, metaformSectionIndex, metaformSection } = useAppSelector(selectMetaform);
  const dispatch = useAppDispatch();

  /**
   * Load data from redux
   */
  const loadData = async () => {
    if (sectionIndex !== undefined && sectionIndex !== metaformSectionIndex) {
      dispatch(setMetaformSection(MetaformUtils.getMetaformSection(pendingForm, sectionIndex)!));
    }
    if (fieldIndex !== undefined && fieldIndex !== metaformFieldIndex) {
      dispatch(setMetaformField(MetaformUtils.getMetaformField(pendingForm, sectionIndex, fieldIndex)!));
    }
    if (sectionIndex !== metaformSectionIndex || fieldIndex !== metaformFieldIndex) {
      dispatch(setMetaformSectionIndex(sectionIndex));
      dispatch(setMetaformFieldIndex(fieldIndex));
    }
  };

  useEffect(() => {
    loadData();
  }, [ sectionIndex, fieldIndex, pendingForm ]);

  /**
   * Updates field with visibility
   *
   * @param field edited field
   * @param optionIndex option index
   */
  const updateFormField = (field: MetaformField, optionIndex?: number) => {
    if (!metaformField || sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      if (MetaformUtils.fieldTypesAllowVisibility.includes(field.type)) {
        const checkedName = pendingForm.sections![metaformSectionIndex!].fields![metaformFieldIndex!];
        if ((checkedName!.name !== undefined && field.name !== checkedName!.name) || optionIndex !== undefined) {
          const fieldOptionMatch = optionIndex !== undefined ?
            pendingForm.sections![sectionIndex].fields![fieldIndex].options![optionIndex] :
            undefined;
          const fieldNameMatch = pendingForm.sections![sectionIndex].fields![fieldIndex].name || "";

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

          fieldRules.forEach(rule => {
            if ((checkedName!.name !== undefined && field.name !== checkedName!.name)) {
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
          });
        }
      }

      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, field);
    });

    setPendingForm(updatedForm);
  };

  useEffect(() => {
    if (updatedMetaformField) {
      updateFormField(updatedMetaformField);
    }
  }, [updatedMetaformField]);

  /**
   * Updates metaform section
   *
   * @param metaformSection metaform section what we are editing
   */
  const updateFormSection = (selectedMetaformSection: MetaformSection) => {
    if (sectionIndex === undefined) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.splice(sectionIndex, 1, selectedMetaformSection);
    });

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
              setUpdatedMetaformField={ setUpdatedMetaformField }
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
              setPendingForm={ setPendingForm }
              setUpdatedMetaformField={ setUpdatedMetaformField }
            />
            <Divider/>
            <MetaformDefineMemberGroupComponent
              memberGroups={ memberGroups }
              setUpdatedMetaformField={ setUpdatedMetaformField }
            />
            <Divider/>
          </>
        );
      case MetaformFieldType.Table:
        return (
          <>
            <MetaformTableComponent
              setUpdatedMetaformField={ setUpdatedMetaformField }
            />
            <Divider/>
          </>
        );
      case MetaformFieldType.Date:
      case MetaformFieldType.DateTime:
        return (
          <>
            <MetaformDateTimeComponent
              setUpdatedMetaformField={ setUpdatedMetaformField }
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
        setUpdatedMetaformField={ setUpdatedMetaformField }
      />
      <Divider/>
      { renderFieldProperties(field) }
      <MetaformContextOptionsComponent
        setUpdatedMetaformField={ setUpdatedMetaformField }
      />
      <Divider/>
      <MetaformFieldRequiredComponent
        setUpdatedMetaformField={ setUpdatedMetaformField }
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
    if (metaformField !== undefined && metaformSection !== undefined) {
      return renderFieldEditor(metaformField);
    }

    if (metaformSection !== undefined) {
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