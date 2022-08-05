/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Icon, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import DraggableWrapper from "components/generic/drag-and-drop/draggable-wrapper";
import DroppableComponentWrapper from "components/generic/drag-and-drop/droppable-component-wrapper";
import TabPanel from "components/generic/tab-panel";
import { Metaform, MetaformField, MetaformFieldType } from "generated/client";
import strings from "localization/strings";
import React, { ChangeEventHandler } from "react";
import { EditorDrawer } from "styled/editor/metaform-editor";
import { DraggingMode } from "types";
import MetaformUtils from "utils/metaform-utils";
import FieldAddable from "./field-addable/field-addable";
import AddableFieldRenderer from "./field-renderer/addable-field-renderer";

/**
 * Component properties
 */
interface Props {
  pendingForm?: Metaform;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Draft editor left drawer component
 */
const MetaformEditorLeftDrawer: React.FC<Props> = ({
  pendingForm,
  setPendingForm
}) => {
  const [ tabIndex, setTabIndex ] = React.useState(0);

  /**
   * Event handler for metaform property change
   *
   * @param key metaform property key
   */
  const onMetaformPropertyChange = (key: keyof Metaform): ChangeEventHandler<HTMLInputElement> =>
    ({ target: { value } }) => {
      pendingForm && setPendingForm({ ...pendingForm, [key]: value });
    };

  /**
   * Renders form tab
   */
  const renderFormTab = () => (
    <TextField
      label={ strings.draftEditorScreen.editor.form.formTitle }
      value={ pendingForm?.title }
      onChange={ onMetaformPropertyChange("title") }
    />
  );

  /**
   * Renders fields tab
   */
  const renderFieldsTab = (field: MetaformField, name: string, icon: string) => (
    <DroppableComponentWrapper
      isDropDisabled
      droppableId={ DraggingMode.ADD_FIELD.toString() }
    >
      <DraggableWrapper
        index={ 0 }
        draggableId={ field.type.toString() }
        isDragDisabled={ false }
      >
        <Stack style={{ alignItems: "center" }}>
          <Icon>{ icon }</Icon>
          <Box>{ name }</Box>
        </Stack>
      </DraggableWrapper>
    </DroppableComponentWrapper>
  );

  /**
   * Renders fields category title
   */
  const renderFieldsCategorytitle = (title: string) => (
    <Typography variant="subtitle1" style={{ width: "100%" }}>
      { title }
    </Typography>
  );

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
          label={ strings.draftEditorScreen.editor.form.tabTitle }
        />
        <Tab
          value={ 1 }
          label={ strings.draftEditorScreen.editor.fields.tabTitle }
        />
      </Tabs>
      <TabPanel value={ tabIndex } index={ 0 }>
        { renderFormTab() }
      </TabPanel>
      <TabPanel value={ tabIndex } index={ 1 }>
        { renderFieldsCategorytitle("Static elements") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Url), "Url", "http") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Html), "Html", "html") }
        { renderFieldsCategorytitle("Selectors") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Boolean), "Boolean", "checkbox") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Select), "Select", "expand_circle_down") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Slider), "Slider", "linear_scale") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Checklist), "Checklist", "fact_check") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Radio), "Radio", "radio_button_checked") }
        { renderFieldsCategorytitle("Inputs") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Text), "Text", "text_fields") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Number), "Number", "looks_one") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Email), "Email", "email") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Memo), "Notes", "notes") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Date), "Date", "today") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.DateTime), "Date & time", "today") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Files), "Files", "attachment") }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Table), "Table", "table_chart") }
      </TabPanel>
    </EditorDrawer>
  );
};

export default MetaformEditorLeftDrawer;