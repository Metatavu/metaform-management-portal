/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tab, Tabs, TextField } from "@mui/material";
import DraggableWrapper from "components/generic/drag-and-drop/draggable-wrapper";
import DroppableWrapper from "components/generic/drag-and-drop/droppable-wrapper";
import TabPanel from "components/generic/tab-panel";
import { Metaform, MetaformField, MetaformFieldType } from "generated/client";
import strings from "localization/strings";
import React, { ChangeEventHandler } from "react";
import { EditorDrawer } from "styled/editor/metaform-editor";
import { DraggingMode } from "types";
import MetaformUtils from "utils/metaform-utils";
import FieldAddable from "./field-addable/field-addable";
import FieldRenderer from "./field-renderer/field-renderer";

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
  const renderFieldsTab = (field: MetaformField) => (
    <DroppableWrapper
      isDropDisabled
      droppableId={ DraggingMode.ADD_FIELD.toString() }
    >
      <DraggableWrapper
        index={ 0 }
        draggableId={ field.type.toString() }
        isDragDisabled={ false }
      >
        {/* TODO populate all of this with metaform field components */}
        <FieldRenderer
          field={ field }
          fieldLabelId=""
          fieldId=""
        />
      </DraggableWrapper>
    </DroppableWrapper>
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
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Text)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Boolean)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Memo)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Number)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Email)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Url)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Slider)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Checklist)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Radio)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Date)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.DateTime)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Html)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Files)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Select)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Submit)) }
        { renderFieldsTab(MetaformUtils.createEmptyField(MetaformFieldType.Table)) }
      </TabPanel>
    </EditorDrawer>
  );
};

export default MetaformEditorLeftDrawer;