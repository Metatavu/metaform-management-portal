import { Checkbox, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, Tab, Tabs, TextField, Typography } from "@mui/material";
import TabPanel from "components/generic/tab-panel";
import { Metaform, MetaformField, MetaformSection } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React from "react";
import { EditorDrawer } from "styled/editor/metaform-editor";

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
const MetaformEditorRightDrawer: React.FC<Props> = ({
  sectionIndex,
  fieldIndex,
  pendingForm,
  setPendingForm
}) => {
  const [ tabIndex, setTabIndex ] = React.useState(0);
  const [ disabledValue, setdisabledValue ] = React.useState<boolean>(false);
  const [ requiredField, setRequiredField ] = React.useState<any>("");
  const [ requiredFieldBoolean, setRequiredFieldBoolean ] = React.useState<string>("");

  /**
   * Updates metaform field
   *
   * @param newMetaformField new metaform field
   */
  const updateFormField = (newMetaformField: MetaformField) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const field = 2;
    
    if (field === undefined) {
      return;
    }
    
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, newMetaformField);
    });
    setPendingForm(updatedForm);
  };

  /**
   * Updates metaform field VisiblityIf
   *
   * @param newMetaformField new metaform field
   */
  const updateFormFieldVisiblityValues = (newMetaformField: MetaformField, eventValue: string) => {
    setRequiredFieldBoolean(eventValue);
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const field = 2;
    
    if (field === undefined) {
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
  const renderFieldsCategorytitle = (title: string) => {
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
   * Render feature components
   * 
   */
  const featureComponents = () => {
    if (sectionIndex === undefined && fieldIndex === undefined) {
      return (
        <Typography>{ strings.draftEditorScreen.editor.features.selectComponent }</Typography>
      );
    }
    if (sectionIndex !== undefined && fieldIndex === undefined) {
      const section = pendingForm.sections![sectionIndex];
      return (
        <TextField
          value={ section.title }
          label={ strings.draftEditorScreen.editor.features.sectionTitle }
          onChange={ event => updateFormSection({ ...section, title: event.target.value }) }
        />
      );
    }

    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const field = pendingForm.sections![sectionIndex].fields![fieldIndex];
      if (field === undefined) {
        return null;
      }
      if (field !== undefined) {
        const disableForm = field.type === "select" || field.type === "date-time" || field.type === "radio" || field.type === "checklist" || field.type === "date";

        return (
          <>
            { renderFieldsCategorytitle(strings.draftEditorScreen.editor.features.fieldDatas) }
            <TextField
              label={ strings.draftEditorScreen.editor.features.fieldTitle }
              value={ field.title ? field.title : " " }
              onChange={ event => updateFormField({
                ...field, title: event.target.value, name: `${sectionIndex}.${fieldIndex}`
              }) }
            />
        
            <Divider/>
            { renderFieldsCategorytitle(strings.draftEditorScreen.editor.features.required) }
            <FormControlLabel
              label={ strings.generic.yes }
              control={
                <Checkbox
                  value={ field.required || false }
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
                    value={ field.required || false }
                    onChange={ event => updateFormField({ ...field, required: event.target.checked }) }
                  />
                }
              />
              <Typography fontSize="12px">
                { strings.draftEditorScreen.editor.features.selectableOnlyOn }
              </Typography>
            </FormControl>
          </>
        );
      }
    }
  };

  /**
   * Render visiblity condition selection menu
   *
   */
  const fieldConditionComponent = () => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      return (
        <>
          { renderFieldsCategorytitle(strings.draftEditorScreen.editor.features.visiblityCondition) }
          <FormControl fullWidth disabled={ !disabledValue }>
            <InputLabel id="visiblityConditionLabel2">{ strings.draftEditorScreen.editor.visibility.conditionLabelTitle }</InputLabel>
            <Select
              fullWidth
              labelId="visiblityConditionLabel2"
              label={ strings.draftEditorScreen.editor.visibility.conditionLabelTitle }
              value={ requiredField }
              onChange={ event => setRequiredField(event.target.value) }
            >
              { pendingForm.sections!.map(section => section.fields!.map((field, index) => {
                const key2 = `${field.title}-${index}`;
                return (
                  <MenuItem value={ field.name } key={ key2 }>
                    { field.title }
                  </MenuItem>
                );
              }))
              }
            </Select>
          </FormControl>
        </>
      );
    }
  };

  /**
   * Render visiblity condition boolean menu
   * 
   */
  const conditionValueField = () => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const field = pendingForm.sections![sectionIndex].fields![fieldIndex];
      if (requiredField === "") {
        return null;
      }
      if (requiredField !== "") {
        return (
          <>
            <FormControl fullWidth>
              <InputLabel id="visiblityConditionLabel21">{ strings.draftEditorScreen.editor.visibility.conditionalFieldValue }</InputLabel>
              <Select
                fullWidth
                labelId="visiblityConditionLabel21"
                label={ strings.draftEditorScreen.editor.visibility.conditionalFieldValue }
                value={ requiredFieldBoolean }
                onChange={ event => updateFormFieldVisiblityValues({
                  ...field,
                  visibleIf: {
                    field: requiredField,
                    equals: event.target.value,
                    notEquals: "",
                    and: [],
                    or: []
                  }
                }, event.target.value) }
              >
                <MenuItem value="kylla">{ strings.generic.yes }</MenuItem>
                <MenuItem value="ei">{ strings.generic.no }</MenuItem>
              </Select>
            </FormControl>
            <Divider/>
          </>
        );
      }
    }
  };

  /**
  * Render components depending what is switch value
  * @param value Switch value true false
  * 
  */
  const setSwitchValue = (value: boolean) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const field = pendingForm.sections![sectionIndex].fields![fieldIndex];
      setdisabledValue(value);
      if (disabledValue === true) {
        setRequiredField("");
        setRequiredFieldBoolean("");
        updateFormField({ ...field, visibleIf: undefined });
      }
      fieldConditionComponent();
      conditionValueField();
    }
  };

  /**
   * Render Visiblity switch component
   * 
   */
  const visiblitySwitch = () => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      return (
        <>
          { renderFieldsCategorytitle(strings.draftEditorScreen.editor.features.fieldVisiblity) }
          <FormControlLabel
            control={
              <Switch
                checked={ disabledValue }
                onChange={event => setSwitchValue(event.target.checked) }
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
    <EditorDrawer style={{ height: "500px" }}>
      <Tabs
        onChange={ (_, value: number) => setTabIndex(value) }
        value={ tabIndex }
      >
        <Tab
          value={ 0 }
          label={ strings.draftEditorScreen.editor.features.tabTitle }
        />
        <Tab
          value={ 1 }
          label={ strings.draftEditorScreen.editor.visibility.tabTitle }
        />
      </Tabs>
      <TabPanel value={ tabIndex } index={ 0 }>
        { featureComponents() }
      </TabPanel>

      <TabPanel value={ tabIndex } index={ 1 }>
        { visiblitySwitch() }
        { fieldConditionComponent() }
        { conditionValueField() }
      </TabPanel>

    </EditorDrawer>
  );
};

export default MetaformEditorRightDrawer;