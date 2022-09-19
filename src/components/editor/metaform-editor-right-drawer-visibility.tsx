import { Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformSection } from "generated/client";
import produce from "immer";
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
 * Draft editor right drawer visibility component
 */
const MetaformEditorRightDrawerVisibleCondition: FC<Props> = ({
  sectionIndex,
  fieldIndex,
  pendingForm,
  setPendingForm
}) => {
  const [ disabledValue, setDisabledValue ] = React.useState<boolean>(false);
  const [ requiredConditionField, setRequiredConditionField ] = React.useState<string>("");
  const [ requiredConditionEqualsValue, setRequiredConditionEqualsValue ] = React.useState<string>("");
  const [ requiredConditionInfoField, setRequiredConditionInfoField ] = React.useState<boolean>(true);
  const [ selectedComponent, setSelectedComponent ] = React.useState<string | undefined>(undefined);
  const [ metaFormFieldSection, setMetaFormFieldSection ] = React.useState<MetaformField | MetaformSection>();

  /**
   * Set values of Confidition field, switch and get selected component name
   * 
   */
  const setVisiblityComponentValues = () => {
    if (fieldIndex === undefined && sectionIndex !== undefined) {
      const section = pendingForm.sections![sectionIndex].visibleIf;
      setMetaFormFieldSection(pendingForm.sections![sectionIndex]);
      setDisabledValue(!!section);
      setRequiredConditionField(section ? section.field! : "");
      setRequiredConditionEqualsValue(section ? section.equals! : "");
      setRequiredConditionInfoField(!section);
      setSelectedComponent(pendingForm.sections![sectionIndex].title);
    }

    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const field = pendingForm.sections![sectionIndex].fields![fieldIndex].visibleIf;
      setMetaFormFieldSection(pendingForm.sections![sectionIndex].fields![fieldIndex]);
      setSelectedComponent(pendingForm.sections![sectionIndex].fields![fieldIndex].name);
      setDisabledValue(!!field);
      setRequiredConditionField(field ? field.field! : "");
      setRequiredConditionEqualsValue(field ? field.equals! : "");
      setRequiredConditionInfoField(!field);
    }
  };
  
  useEffect(() => {
    setVisiblityComponentValues();
  }, [fieldIndex, sectionIndex]);

  /**
   * Empties metaformField visibleIf conditions
   *
   * @param metaformField metaformField what we change
   */
  const emptyFormFieldVisibleIf = (metaformField: MetaformField) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, metaformField);
    });
    setPendingForm(updatedForm);
  };

  /**
   * Updates metaform field or section visibleIf parameters
   *
   * @param newMetaformUpdateFieldOrSection metaform field or section
   * @param value event condition equals value (yes / no)
   */
  const updateFormFieldOrSectionVisiblityValues = (newMetaformUpdateFieldOrSection: MetaformField | MetaformSection, value: string) => {
    setRequiredConditionEqualsValue(value);
    setRequiredConditionInfoField(false);
    if (sectionIndex === undefined) {
      return;
    }
    if (sectionIndex !== undefined && fieldIndex === undefined) {
      const updatedForm = produce(pendingForm, draftForm => {
        draftForm.sections?.splice(sectionIndex, 1, newMetaformUpdateFieldOrSection as MetaformSection);
      });
      setPendingForm(updatedForm);
    }
    if (sectionIndex !== undefined && fieldIndex !== undefined) {
      const updatedForm = produce(pendingForm, draftForm => {
        draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, newMetaformUpdateFieldOrSection as MetaformField);
      });
      setPendingForm(updatedForm);
    }
  };

  /**
   * Empties metaformSection visibleIf
   *
   * @param metaformSection  metaform section what we are editing
   */
  const emptyFormSectionVisibleIf = (metaFormSection: MetaformSection) => {
    if (sectionIndex === undefined) {
      return;
    }

    const section = pendingForm.sections![sectionIndex];
    if (!section) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.splice(sectionIndex, 1, metaFormSection);
    });

    setPendingForm(updatedForm);
  };

  /**
   * Render visiblity condition selection menu
   *
   */
  const fieldConditionComponent = () => {
    if (sectionIndex !== undefined) {
      const labelText = requiredConditionField
        ? strings.draftEditorScreen.editor.visibility.conditionLabelTitle
        : strings.draftEditorScreen.editor.visibility.fieldDefiningCondition;
      return (
        <>
          <Typography variant="subtitle1" style={{ width: "100%" }}>
            { strings.draftEditorScreen.editor.features.visiblityCondition }
          </Typography>
          <FormControl fullWidth disabled={ !disabledValue }>
            <InputLabel id="fieldCategoryVisiblityConditionLabel">
              { labelText }
            </InputLabel>
            <Select
              fullWidth
              labelId="fieldCategoryVisiblityConditionLabel"
              label={ labelText }
              value={ requiredConditionField }
              onChange={ event => setRequiredConditionField(event.target.value) }
            >
              <MenuItem sx={{ color: "gray" }}>{ strings.draftEditorScreen.editor.visibility.selectField }</MenuItem>
              { pendingForm.sections!.map(section => section.fields!.map((field, index) => {
                const constructedKey = `${field.title}-${index}`;
                if (field.type === "radio" || field.type === "checklist" || field.type === "select") {
                  if (field.name !== selectedComponent) {
                    return (
                      <MenuItem value={ field.name } key={ constructedKey }>
                        { field.title }
                      </MenuItem>
                    );
                  }
                }
                return null;
              }))
              }
              
            </Select>
          </FormControl>
        </>
      );
    }
  };

  /**
   * Render field Condition info component
   */
  const fieldConditionInfoComponent = () => {
    if (!requiredConditionField && disabledValue) {
      return (
        <Typography sx={{ color: "gray" }}>
          { strings.draftEditorScreen.editor.visibility.conditionalFieldInfo }
        </Typography>
      );
    }
  };

  /**
   * Check group field options
   * @param field multi options field where we get option values
   * @returns options from field
   */
  const renderFieldConditionOptions = (field: MetaformField) => (
    field.options!.map((option, index) => {
      const constructedKey = `${option.text}-${index}-`;
      return (
        <MenuItem value={ option.name } key={ constructedKey }>
          { option.text }
        </MenuItem>
      );
    })
  );

  /**
   * Render visiblity condition select menu
   */
  const conditionValueField = () => {
    if (sectionIndex !== undefined) {
      if (!requiredConditionField) {
        return null;
      }
      return (
        <>
          <FormControl fullWidth>
            <InputLabel id="visiblityConditionLabel">{ strings.draftEditorScreen.editor.visibility.conditionalFieldValue }</InputLabel>
            <Select
              fullWidth
              labelId="visiblityConditionLabel"
              label={ strings.draftEditorScreen.editor.visibility.conditionalFieldValue }
              value={ requiredConditionEqualsValue }
              onChange={ event => updateFormFieldOrSectionVisiblityValues({
                ...metaFormFieldSection,
                visibleIf: {
                  field: requiredConditionField,
                  equals: event.target.value,
                  notEquals: "",
                  and: [],
                  or: []
                }
              }, event.target.value)
              }
            >
              { pendingForm.sections!.map(section => section.fields!.map(field => {
                if (field.name === requiredConditionField) {
                  if (field.type === "radio" || field.type === "checklist" || field.type === "select") {
                    return (
                      renderFieldConditionOptions(field)
                    );
                  }
                }
                return null;
              }))}
              ;

            </Select>
          </FormControl>
          { requiredConditionInfoField && <Typography sx={{ color: "gray" }}>{ strings.draftEditorScreen.editor.visibility.conditionalFieldValueInfo }</Typography> }
          <Divider/>
        </>
      );
    }
  };

  /**
  * Render components depending what is switch value
  * 
  * @param value Switch value true or false
  */
  const setSwitchValue = (value: boolean) => {
    if (sectionIndex === undefined) {
      return;
    }

    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const field = pendingForm.sections![sectionIndex].fields![fieldIndex];
      setDisabledValue(value);
      
      if (disabledValue) {
        setRequiredConditionField("");
        setRequiredConditionEqualsValue("");
        setRequiredConditionInfoField(true);
        emptyFormFieldVisibleIf({ ...field, visibleIf: undefined });
      }

      fieldConditionComponent();
      conditionValueField();
    }

    if (sectionIndex !== undefined && fieldIndex === undefined) {
      const section = pendingForm.sections![sectionIndex];
      setDisabledValue(value);

      if (disabledValue) {
        setRequiredConditionField("");
        setRequiredConditionEqualsValue("");
        setRequiredConditionInfoField(true);
        emptyFormSectionVisibleIf({ ...section, visibleIf: undefined });
      }
    }
  };

  /**
   * Render Visiblity switch component
   */
  const visiblitySwitch = () => {
    if (sectionIndex !== undefined) {
      return (
        <>
          <Typography variant="subtitle1" style={{ width: "100%" }}>
            { strings.draftEditorScreen.editor.features.fieldVisiblity }
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={ disabledValue }
                onChange={ event => setSwitchValue(event.target.checked) }
              />
            }
            label={ strings.draftEditorScreen.editor.visibility.conditionally }
          />
          <Divider/>
        </>
      );
    }
  };

  /**
   * Component render
   */
  return (
    <>
      { visiblitySwitch() }
      { fieldConditionComponent() }
      { fieldConditionInfoComponent() }
      { conditionValueField() }
    </>
  );
};

export default MetaformEditorRightDrawerVisibleCondition;