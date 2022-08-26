/* eslint-disable @typescript-eslint/no-unused-vars */
import TabPanel from "components/generic/tab-panel";
import { Checkbox, FormControlLabel, Radio, RadioGroup, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField } from "generated/client";
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

  /**
   * Updates metaform field
   *
   * @param newMetaformField new metaform field
   */
  const updateFormField = (newMetaformField: MetaformField) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }

    const field = pendingForm.sections?.[sectionIndex]?.fields?.[fieldIndex];
    if (!field) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, newMetaformField);
    });

    setPendingForm(updatedForm);
  };

  /**
   * Renders fields category title
   */
  const renderFieldsCategorytitle = (title: string) => (
    <Typography
      variant="subtitle1"
      style={{
        width: "100%",
        textAlign: "center",
        display: "flex"
      }}
    >
      { !sectionIndex !== undefined && fieldIndex !== undefined ? null : title }
    </Typography>
  );

  /**
   * Renders fields tab
   */
  const renderFieldsTab = () => {
    const infoText = strings.draftEditorScreen.editor.features;
    
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }

    const field = pendingForm.sections![sectionIndex].fields![fieldIndex];
    return (
      <>
        <h2>{infoText.fieldHeader}</h2>
        <TextField
          label={infoText.labelText}
          value={ field.name && undefined}
          onChange={ event => updateFormField({ ...field, name: event.target.value }) }
        />
        <FormControlLabel
          label={infoText.requiredField}
          control={
            <Checkbox
              value={ field.required }
              onChange={ event => updateFormField({ ...field, required: event.target.checked }) }
            />
            
          }
        />
      </>
    );
  };

  const editorScreen = strings.draftEditorScreen.editor;
  /**
   * Component render
   */
  return (
    <EditorDrawer>
      <Tabs
        onChange={ (_, value: number) => setTabIndex(value) }
        value={ tabIndex }
      >
        <Tab
          value={ 0 }
          label={ editorScreen.features.tabTitle }
        />
        <Tab
          value={ 1 }
          label={ editorScreen.visibility.tabTitle }
        />
      </Tabs>
      <TabPanel value={ tabIndex } index={ 0 }>
        { renderFieldsCategorytitle(editorScreen.features.fieldDatas) }
        { renderFieldsTab() }
      </TabPanel>
      <TabPanel value={ tabIndex } index={ 1 }>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
        >
          <FormControlLabel value="Required" control={<Radio/>} label="Required"/>
          <FormControlLabel value="Not-required" control={<Radio/>} label="Not required"/>
        </RadioGroup>
      </TabPanel>
    </EditorDrawer>
  );
};

export default MetaformEditorRightDrawer;