import { Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformSection } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { useEffect } from "react";

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
 * Draft editor right drawer component
 */
const MetaformEditorRightDrawerVisibleCondition: React.FC<Props> = ({
  sectionIndex,
  fieldIndex,
  pendingForm,
  setPendingForm
}) => {
  const [ disabledValue, setDisabledValue ] = React.useState<boolean>(false);
  const [ requiredConditionField, setRequiredConditionField ] = React.useState<string>("");
  const [ requiredConditionEqualsValue, setRequiredConditionEqualsValue ] = React.useState<string>("");
  const [ requiredConditionInfoField, setRequiredConditionInfoField ] = React.useState<boolean>(true);
  const [ selectedComponent, setSelectedComponent] = React.useState<string | undefined>("");
  const [ metaFormFieldSection, setMetaFormFieldSection] = React.useState<MetaformField | MetaformSection>();

  /**
   * Set values of Confidition field, switch and get selected component name
   * 
   */
  const setVisiblityComponentValues = () => {
    if (fieldIndex === undefined && sectionIndex !== undefined) {
      const section = pendingForm.sections![sectionIndex].visibleIf;
      setMetaFormFieldSection(pendingForm.sections![sectionIndex]);
      setDisabledValue(section !== undefined);
      setRequiredConditionField(section ? section.field! : "");
      setRequiredConditionEqualsValue(section ? section.equals! : "");
      setRequiredConditionInfoField(!section as boolean);
      setSelectedComponent(pendingForm.sections![sectionIndex].title);
    }

    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const field = pendingForm.sections![sectionIndex].fields![fieldIndex].visibleIf;
      setMetaFormFieldSection(pendingForm.sections![sectionIndex].fields![fieldIndex]);
      setSelectedComponent(pendingForm.sections![sectionIndex].fields![fieldIndex].name);
      setDisabledValue(field !== undefined);
      setRequiredConditionField(field ? field.field! : "");
      setRequiredConditionEqualsValue(field ? field.equals! : "");
      setRequiredConditionInfoField(!field as boolean);
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
  const emptyFormFieldVisibleIf = (newMetaformField: MetaformField) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, newMetaformField);
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
    // TODO const amountOfRadios = pendingForm.sections!.map(x => x.fields?.filter(y => y.type === MetaformFieldType.Radio)).flat().length;
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
   * Updates metaform section
   *
   * @param newMetaformSection new metaform section
   */
  const emptyFormSectionVisibleIf = (newMetaformSection: MetaformSection) => {
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
          {title}
        </Typography>

      );
    }
  };

  /**
   * Render visiblity condition selection menu
   *
   */
  const fieldConditionComponent = () => {
    if (sectionIndex !== undefined) {
      return (
        <>
          { renderFieldsCategoryTitle(strings.draftEditorScreen.editor.features.visiblityCondition) }
          <FormControl fullWidth disabled={ !disabledValue }>
            <InputLabel id="fieldCategoryVisiblityConditionLabel">
              { requiredConditionField ?
                strings.draftEditorScreen.editor.visibility.conditionLabelTitle :
                strings.draftEditorScreen.editor.visibility.fieldDefiningCondition
              }
            </InputLabel>
            <Select
              fullWidth
              labelId="fieldCategoryVisiblityConditionLabel"
              label={ requiredConditionField ?
                strings.draftEditorScreen.editor.visibility.conditionLabelTitle :
                strings.draftEditorScreen.editor.visibility.fieldDefiningCondition
              }
              value={ requiredConditionField }
              onChange={ event => setRequiredConditionField(event.target.value) }
            >
              <MenuItem sx={{ color: "gray" }}>{ strings.draftEditorScreen.editor.visibility.selectField }</MenuItem>
              { pendingForm.sections!.map(section => section.fields!.map((field, index) => {
                const constructedKey = `${field.title}-${index}`;
                if (field.type === "radio" || field.type === "checklist" || field.type === "boolean") {
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
   * 
   * Render field Condition info component
   */
  const fieldConditionInfoComponent = () => {
    if (requiredConditionField === "" && disabledValue) {
      return (
        <Typography sx={{ color: "gray" }}>
          { strings.draftEditorScreen.editor.visibility.conditionalFieldInfo }
        </Typography>
      );
    }

    return null;
  };

  /**
   * Check options of demanded metaformField 
   * @param field MetaformField where we get option values
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
   * 
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
                  return (
                    renderFieldConditionOptions(field)
                  );
                }
                return null;
              }))}
              ;

            </Select>
          </FormControl>
          { requiredConditionInfoField
            ? <Typography sx={{ color: "gray" }}>{ strings.draftEditorScreen.editor.visibility.conditionalFieldValueInfo }</Typography>
            : null
          }
          <Divider/>
        </>
      );
    }
  };

  /**
  * Render components depending what is switch value
  * @param value Switch value true or false
  * 
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
   * 
   */
  const visiblitySwitch = () => {
    if (sectionIndex !== undefined) {
      return (
        <>
          { renderFieldsCategoryTitle(strings.draftEditorScreen.editor.features.fieldVisiblity) }
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