import { FormControl, FormLabel, Icon, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import DraggableWrapper from "components/generic/drag-and-drop/draggable-wrapper";
import DroppableComponentWrapper from "components/generic/drag-and-drop/droppable-component-wrapper";
import TabPanel from "components/generic/tab-panel";
import { Metaform, MetaformField, MetaformFieldType } from "generated/client";
import strings from "localization/strings";
import React, { ChangeEventHandler } from "react";
import { EditorDrawer } from "styled/editor/metaform-editor";
import { DraggingMode } from "types";
import MetaformUtils from "utils/metaform-utils";
import slugify from "slugify";

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
  const currentHostname = window.location.hostname;

  /**
   * Event handler for metaform property change
   *
   * @param title metaform title 
   * @param slug metaform slug
   */
  const onMetaformPropertyChange = (title: keyof Metaform, slug: keyof Metaform): ChangeEventHandler<HTMLInputElement> =>
    ({ target: { value } }) => {
      pendingForm && setPendingForm({
        ...pendingForm,
        [title]: value,
        [slug]: slugify(value, { lower: true })
      });
    };

  /**
   * Renders form tab
   */
  const renderFormTab = () => (
    <FormControl fullWidth>
      <Stack spacing={ 2 } padding={ 1 }>
        <FormLabel>{ strings.draftEditorScreen.editor.form.versionInfo }</FormLabel>
        <TextField
          label={ strings.draftEditorScreen.editor.form.formTitle }
          value={ pendingForm?.title }
          onChange={ onMetaformPropertyChange("title", "slug") }
        />
        <TextField
          label={ strings.draftEditorScreen.editor.form.formSlugUrl }
          value={ `${currentHostname}/${pendingForm?.slug}` }
          disabled
        />
      </Stack>
    </FormControl>
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
        <Stack style={{ alignItems: "center", textAlign: "center" }}>
          <Icon>{ icon }</Icon>
          <Typography variant="caption">{ name }</Typography>
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
      <TabPanel value={ tabIndex } index={ 0 } padding={ 0 }>
        { renderFormTab() }
      </TabPanel>
      <TabPanel value={ tabIndex } index={ 1 }>
        { renderFieldsCategorytitle(strings.draftEditorScreen.editor.fields.staticFields) }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Html), strings.draftEditorScreen.editor.fields.html, "html") }
        { renderFieldsCategorytitle(strings.draftEditorScreen.editor.fields.selectorFields) }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Boolean), strings.draftEditorScreen.editor.fields.boolean, "checkbox") }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Select), strings.draftEditorScreen.editor.fields.select, "expand_circle_down") }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Slider), strings.draftEditorScreen.editor.fields.slider, "linear_scale") }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Checklist), strings.draftEditorScreen.editor.fields.checklist, "fact_check") }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Radio), strings.draftEditorScreen.editor.fields.radio, "radio_button_checked") }
        { renderFieldsCategorytitle(strings.draftEditorScreen.editor.fields.inputFields) }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Text), strings.draftEditorScreen.editor.fields.text, "text_fields") }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Number), strings.draftEditorScreen.editor.fields.number, "looks_one") }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Memo), strings.draftEditorScreen.editor.fields.memo, "notes") }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Date), strings.draftEditorScreen.editor.fields.date, "today") }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.DateTime), strings.draftEditorScreen.editor.fields.dateAndTime, "today") }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Files), strings.draftEditorScreen.editor.fields.files, "attachment") }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Table), strings.draftEditorScreen.editor.fields.table, "table_chart") }
        { renderFieldsTab(MetaformUtils.createField(MetaformFieldType.Submit), strings.draftEditorScreen.editor.fields.submit, "send") }
      </TabPanel>
    </EditorDrawer>
  );
};

export default MetaformEditorLeftDrawer;