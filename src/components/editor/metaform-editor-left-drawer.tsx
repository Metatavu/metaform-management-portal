import { FormControl, Icon, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import DraggableWrapper from "components/generic/drag-and-drop/draggable-wrapper";
import DroppableComponentWrapper from "components/generic/drag-and-drop/droppable-component-wrapper";
import TabPanel from "components/generic/tab-panel";
import { Metaform, MetaformFieldType } from "generated/client";
import strings from "localization/strings";
import React, { ChangeEventHandler } from "react";
import { EditorDrawer } from "styled/editor/metaform-editor";
import { DraggingMode } from "types";
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
      <Stack spacing={ 2 }>
        <Typography variant="subtitle1">
          { strings.draftEditorScreen.editor.form.versionInfo }
        </Typography>
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
   * Renders field draggable
   *
   * @param fieldType field type
   * @param name name
   * @param icon icon
   */
  const renderFieldDraggable = (fieldType: MetaformFieldType, name: string, icon: string) => (
    <DroppableComponentWrapper
      isDropDisabled
      droppableId={ `${DraggingMode.ADD_FIELD.toString()}-${fieldType.toString()}` }
    >
      <DraggableWrapper
        index={ 0 }
        draggableId={ fieldType.toString() }
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
   *
   * @param title title
   */
  const renderFieldsCategoryTitle = (title: string) => (
    <Typography variant="subtitle1" style={{ width: "100%" }}>
      { title }
    </Typography>
  );

  /**
   * Render fields tab
   */
  const renderFieldsTab = () => (
    <>
      { renderFieldsCategoryTitle(strings.draftEditorScreen.editor.fields.staticFields) }
      { renderFieldDraggable(MetaformFieldType.Html, strings.draftEditorScreen.editor.fields.html, "html") }
      { renderFieldsCategoryTitle(strings.draftEditorScreen.editor.fields.selectorFields) }
      { renderFieldDraggable(MetaformFieldType.Boolean, strings.draftEditorScreen.editor.fields.boolean, "checkbox") }
      { renderFieldDraggable(MetaformFieldType.Select, strings.draftEditorScreen.editor.fields.select, "expand_circle_down") }
      { renderFieldDraggable(MetaformFieldType.Slider, strings.draftEditorScreen.editor.fields.slider, "linear_scale") }
      { renderFieldDraggable(MetaformFieldType.Checklist, strings.draftEditorScreen.editor.fields.checklist, "fact_check") }
      { renderFieldDraggable(MetaformFieldType.Radio, strings.draftEditorScreen.editor.fields.radio, "radio_button_checked") }
      { renderFieldsCategoryTitle(strings.draftEditorScreen.editor.fields.inputFields) }
      { renderFieldDraggable(MetaformFieldType.Text, strings.draftEditorScreen.editor.fields.text, "text_fields") }
      { renderFieldDraggable(MetaformFieldType.Number, strings.draftEditorScreen.editor.fields.number, "looks_one") }
      { renderFieldDraggable(MetaformFieldType.Memo, strings.draftEditorScreen.editor.fields.memo, "notes") }
      { renderFieldDraggable(MetaformFieldType.Date, strings.draftEditorScreen.editor.fields.date, "today") }
      { renderFieldDraggable(MetaformFieldType.DateTime, strings.draftEditorScreen.editor.fields.dateAndTime, "today") }
      { renderFieldDraggable(MetaformFieldType.Files, strings.draftEditorScreen.editor.fields.files, "attachment") }
      { renderFieldDraggable(MetaformFieldType.Table, strings.draftEditorScreen.editor.fields.table, "table_chart") }
      { renderFieldDraggable(MetaformFieldType.Submit, strings.draftEditorScreen.editor.fields.submit, "send") }
    </>
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
        { renderFieldsTab() }
      </TabPanel>
    </EditorDrawer>
  );
};

export default MetaformEditorLeftDrawer;