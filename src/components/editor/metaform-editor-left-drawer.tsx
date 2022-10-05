import { Divider, FormControl, FormLabel, Icon, MenuItem, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Metaform, MetaformFieldType, MetaformVisibility } from "generated/client";
import DraggableWrapper from "components/generic/drag-and-drop/draggable-wrapper";
import DroppableComponentWrapper from "components/generic/drag-and-drop/droppable-component-wrapper";
import TabPanel from "components/generic/tab-panel";
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
   * Event handler for metaform visibility change
   * 
   * @param selectedVisibility selected visibility value public or private
   */
  const onFormVisibilityChange = (selectedVisibility: MetaformVisibility) => {
    pendingForm && setPendingForm({
      ...pendingForm,
      visibility: selectedVisibility
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
        <Divider/>
        <FormLabel>{ strings.draftEditorScreen.editor.visibility.formVisibility }</FormLabel>
        <TextField
          select
          label={ strings.draftEditorScreen.editor.visibility.formVisibilityLabel }
          value={ pendingForm?.visibility }
          onChange={ event => onFormVisibilityChange(event.target.value as MetaformVisibility) }
        >
          <MenuItem value={ MetaformVisibility.Public }>{ strings.draftEditorScreen.editor.visibility.public }</MenuItem>
          <MenuItem value={ MetaformVisibility.Private }>{ strings.draftEditorScreen.editor.visibility.private }</MenuItem>
        </TextField>
      </Stack>
    </FormControl>
  );

  /**
   * Renders fields tab
   *
   * @param fieldType field type
   * @param name name
   * @param icon icon
   */
  const renderFieldsTab = (fieldType: MetaformFieldType, name: string, icon: string) => {
    const field = MetaformUtils.createField(fieldType);
    return (
      <DroppableComponentWrapper
        isDropDisabled
        droppableId={ `${DraggingMode.ADD_FIELD.toString()}-${field.type.toString()}` }
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
  };

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
        { renderFieldsCategoryTitle(strings.draftEditorScreen.editor.fields.staticFields) }
        { renderFieldsTab(MetaformFieldType.Html, strings.draftEditorScreen.editor.fields.html, "html") }
        { renderFieldsCategoryTitle(strings.draftEditorScreen.editor.fields.selectorFields) }
        { renderFieldsTab(MetaformFieldType.Boolean, strings.draftEditorScreen.editor.fields.boolean, "checkbox") }
        { renderFieldsTab(MetaformFieldType.Select, strings.draftEditorScreen.editor.fields.select, "expand_circle_down") }
        { renderFieldsTab(MetaformFieldType.Slider, strings.draftEditorScreen.editor.fields.slider, "linear_scale") }
        { renderFieldsTab(MetaformFieldType.Checklist, strings.draftEditorScreen.editor.fields.checklist, "fact_check") }
        { renderFieldsTab(MetaformFieldType.Radio, strings.draftEditorScreen.editor.fields.radio, "radio_button_checked") }
        { renderFieldsCategoryTitle(strings.draftEditorScreen.editor.fields.inputFields) }
        { renderFieldsTab(MetaformFieldType.Text, strings.draftEditorScreen.editor.fields.text, "text_fields") }
        { renderFieldsTab(MetaformFieldType.Number, strings.draftEditorScreen.editor.fields.number, "looks_one") }
        { renderFieldsTab(MetaformFieldType.Memo, strings.draftEditorScreen.editor.fields.memo, "notes") }
        { renderFieldsTab(MetaformFieldType.Date, strings.draftEditorScreen.editor.fields.date, "today") }
        { renderFieldsTab(MetaformFieldType.DateTime, strings.draftEditorScreen.editor.fields.dateAndTime, "today") }
        { renderFieldsTab(MetaformFieldType.Files, strings.draftEditorScreen.editor.fields.files, "attachment") }
        { renderFieldsTab(MetaformFieldType.Table, strings.draftEditorScreen.editor.fields.table, "table_chart") }
        { renderFieldsTab(MetaformFieldType.Submit, strings.draftEditorScreen.editor.fields.submit, "send") }
      </TabPanel>
    </EditorDrawer>
  );
};

export default MetaformEditorLeftDrawer;