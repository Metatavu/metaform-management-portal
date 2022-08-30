/* eslint-disable */
import { Label } from "@mui/icons-material";
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
  const [ hiddenValue, setHiddenValue ] = React.useState<boolean>();
  const [ requiredField, setRequiredField ] = React.useState<any>();
  /**
   * Updates metaform field
   *
   * @param newMetaformField new metaform field
   */
  const updateFormField = (newMetaformField: MetaformField) => {
    console.log(pendingForm);
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
   * Renders form components
   * @param fieldIndex number
   * @param sectionIndex number
   */
  const renderFormTab = () => {
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
          onChange={ event => updateFormSection({ ...section, title: event.target.value })}
        />
      );
    }

    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const field = pendingForm.sections![sectionIndex].fields![fieldIndex];
      if (field === undefined) {
        return null;
      } if (field !== undefined) {
        let disabledV;
        if (field.type === "select" || field.type === "date-time" || field.type === "radio" || field.type === "checklist" || field.type === "date") {
          disabledV = false;
        } else {
          disabledV = true;
        }
        return (
          <>
            { renderFieldsCategorytitle(strings.draftEditorScreen.editor.features.fieldDatas) }
            <TextField
              label={ strings.draftEditorScreen.editor.features.fieldTitle }
              value={ field.title ? field.title : "" }
              onChange={ event => updateFormField({
                ...field, title: event.target.value, name: `name`+ sectionIndex + fieldIndex
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

            <FormControl disabled={ disabledV }>
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
   * Render Visiblity component
   * 
   */
  const renderVisiblity = () => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const field = pendingForm.sections![sectionIndex].fields![fieldIndex];

      return (
        <>
          { renderFieldsCategorytitle(strings.draftEditorScreen.editor.features.fieldVisiblity) }
          <FormControlLabel
            control={
              <Switch
                value
                onChange={event => values(event.target.checked)}
              />
            }
            label={ strings.draftEditorScreen.editor.visibility.conditionally }
          />
          <Divider/>
        </>
      );
    }
  };

  const values = (value: any) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
    const field = pendingForm.sections![sectionIndex].fields![fieldIndex];
    setHiddenValue(value);
    console.log(hiddenValue);
    if (hiddenValue === false) {
      setRequiredField(undefined);  
      updateFormField({ ...field, visibleIf: undefined }) }  
      renderFields();
    }
    if (hiddenValue === true) {
      renderFields();
    }
}

  const renderFields = () => {
    
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const field = pendingForm.sections![sectionIndex].fields![fieldIndex];
      if (requiredField !== undefined) {
        console.log(requiredField);
        return (
          <>
          { renderFieldsCategorytitle(strings.draftEditorScreen.editor.features.visiblityCondition) }
                  <FormControl fullWidth disabled={ !hiddenValue }>
        
                    <InputLabel id="visiblityConditionLabel">{ strings.draftEditorScreen.editor.visibility.conditionLabelTitle }</InputLabel>
                    <Select
                      fullWidth
                      labelId="visiblityConditionLabel"
                      label={ strings.draftEditorScreen.editor.visibility.conditionLabelTitle }
                      value={ requiredField ? requiredField : "" }
                      onChange={ event => setRequiredField(event.target.value)}
                    >
                      { pendingForm!.sections!.map(section => section.fields!.map(x => {
                        return (
                          <MenuItem value={x.name} key={`section-${x}`}>
                            {x.title}
                          </MenuItem>
                        );
                      }))
                      }
        
                    </Select>
                  </FormControl>
        <FormControl fullWidth>
        <InputLabel id="visiblityConditionLabel">{ strings.draftEditorScreen.editor.visibility.conditionalFieldValue }</InputLabel>
        <Select
          fullWidth
          labelId="visiblityConditionLabel"
          label={ strings.draftEditorScreen.editor.visibility.conditionalFieldValue }
          value="visiblityConditionLabel"
          onChange={ event => updateFormField({
            ...field,
            visibleIf: {
              field: requiredField,
              equals: event.target.value,
              notEquals: "",
              and: [],
              or: []
            }
          }) }
        >
          <MenuItem value="kylla">{ strings.generic.yes }</MenuItem>
          <MenuItem value="Ei">{ strings.generic.no }</MenuItem>
        </Select>
      </FormControl>
    </>
      )}

      else if (requiredField === undefined) {
        return (
          <>
          { renderFieldsCategorytitle(strings.draftEditorScreen.editor.features.visiblityCondition) }
                  <FormControl fullWidth disabled={ !hiddenValue }>
        
                    <InputLabel id="visiblityConditionLabel">{ strings.draftEditorScreen.editor.visibility.conditionLabelTitle }</InputLabel>
                    <Select
                      fullWidth
                      labelId="visiblityConditionLabel"
                      label={ strings.draftEditorScreen.editor.visibility.conditionLabelTitle }
                      value={ requiredField ? requiredField : "" }
                      onChange={ event => setRequiredField(event.target.value)}
                    >
                      { pendingForm!.sections!.map(section => section.fields!.map(x => {
                        return (
                          <MenuItem value={x.name} key={`section-${x}`}>
                            {x.title}
                          </MenuItem>
                        );
                      }))
                      }
        
                    </Select>
                  </FormControl>
                  </>
                  )
      }
  }
}
  /**
   * Component render
   */
  return (
    <EditorDrawer style={ { height: "500px" } }>
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
        { renderFormTab() }
      </TabPanel>

      <TabPanel value={ tabIndex } index={ 1 }>
        { renderVisiblity() }
        { renderFields() }
      </TabPanel>

    </EditorDrawer>
  );
};

export default MetaformEditorRightDrawer;