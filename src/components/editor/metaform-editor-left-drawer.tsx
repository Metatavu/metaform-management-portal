import { Checkbox, FormControl, FormControlLabel, FormLabel, Icon, MenuItem, Stack, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import { Metaform, MetaformFieldType, MetaformMemberGroup, MetaformVisibility } from "generated/client";
import DraggableWrapper from "components/generic/drag-and-drop/draggable-wrapper";
import DroppableComponentWrapper from "components/generic/drag-and-drop/droppable-component-wrapper";
import TabPanel from "components/generic/tab-panel";
import strings from "localization/strings";
import React, { ChangeEventHandler, useEffect, useState, FC } from "react";
import { EditorDrawer } from "styled/editor/metaform-editor";
import { DraggingMode } from "types";
import slugify from "slugify";
import produce from "immer";
import { NOT_SELECTED } from "consts";

/**
 * Component properties
 */
interface Props {
  memberGroups: MetaformMemberGroup[],
  pendingForm?: Metaform;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Draft editor left drawer component
 */
const MetaformEditorLeftDrawer: FC<Props> = ({
  memberGroups,
  pendingForm,
  setPendingForm
}) => {
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ selectedDefaultMemberGroup, setSelectedDefaultMemberGroup ] = useState<string>("");
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
   * Event handler for metaform default member group change Permission for default member group is defaulted to "edit"
   * 
   * @param permissionMemberGroup selected member group
   */
  const onDefaultMemberGroupChange = (permissionMemberGroup: string) => {
    if (permissionMemberGroup === NOT_SELECTED) {
      pendingForm && setPendingForm({
        ...pendingForm,
        defaultPermissionGroups: {
          viewGroupIds: [],
          editGroupIds: [],
          notifyGroupIds: []
        }
      });
    } else {
      pendingForm && setPendingForm({
        ...pendingForm,
        defaultPermissionGroups: {
          viewGroupIds: [],
          editGroupIds: [permissionMemberGroup],
          notifyGroupIds: []
        }
      });
    }
    setSelectedDefaultMemberGroup(permissionMemberGroup);
  };

  /**
   * Set default member group notifications on or off 
   * 
   * @param event true or false
   */
  const setNotificationsForDefaultMemberGroup = (event : boolean) => {
    const updatedForm = produce(pendingForm, draftForm => {
      if (event) {
        draftForm!.defaultPermissionGroups!.notifyGroupIds!.push(selectedDefaultMemberGroup);
      } else {
        draftForm!.defaultPermissionGroups!.notifyGroupIds!.splice(0, 1);
      }
    });
    setPendingForm(updatedForm!);
  };
  
  /**
   * Render notifications checkbox if default permission member group
   */
  const renderNotifications = () => {
    const notifyChecked = pendingForm?.defaultPermissionGroups?.notifyGroupIds?.length! > 0;
    if (selectedDefaultMemberGroup && selectedDefaultMemberGroup !== NOT_SELECTED) {
      return (
        <FormControlLabel
          label={ strings.draftEditorScreen.editor.memberGroups.notifications }
          control={
            <Checkbox
              checked={ notifyChecked }
              onChange={ event => setNotificationsForDefaultMemberGroup(event.target.checked) }
            />
          }
        />
      );
    }
  };

  /**
   * Renders form tab
   */
  const renderFormTab = () => (
    <FormControl fullWidth>
      <Stack spacing={ 2 }>
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
        <FormLabel>{ strings.draftEditorScreen.editor.form.formVisibility }</FormLabel>
        <TextField
          select
          label={ strings.draftEditorScreen.editor.form.formVisibilityLabel }
          value={ pendingForm?.visibility }
          onChange={ event => onFormVisibilityChange(event.target.value as MetaformVisibility) }
          disabled={ !JSON.parse(process.env.REACT_APP_FEATURES || "[]").includes("authentication")}
        >
          <MenuItem value={ MetaformVisibility.Public }>{ strings.draftEditorScreen.editor.form.public }</MenuItem>
          <MenuItem value={ MetaformVisibility.Private }>{ strings.draftEditorScreen.editor.form.private }</MenuItem>
        </TextField>
        <FormLabel>{ strings.draftEditorScreen.editor.memberGroups.defaultMemberGroupInfo }</FormLabel>
        <TextField
          select
          label={ strings.draftEditorScreen.editor.memberGroups.defaultMemberGroupInfoLabel }
          value={ selectedDefaultMemberGroup }
          onChange={ event => onDefaultMemberGroupChange(event.target.value) }
        >
          <MenuItem value={ NOT_SELECTED }>{ strings.draftEditorScreen.editor.memberGroups.noDefaultPermissionMemberGroup }</MenuItem>
          { memberGroups.map(field => {
            return (
              <MenuItem value={ field.id } key={ field.id }>
                { field.displayName }
              </MenuItem>
            );
          })
          }
        </TextField>
        { renderNotifications() }
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
   * When open form in form editor, check if form have default member group.
   */
  useEffect(() => {
    const defaultPermissionGroups = pendingForm?.defaultPermissionGroups;
    setSelectedDefaultMemberGroup(defaultPermissionGroups?.editGroupIds!.length ? defaultPermissionGroups?.editGroupIds![0] : selectedDefaultMemberGroup);
  }, []);

  /**
   * Render fields tab
   */
  const renderFieldsTab = () => (
    <>
      <FormLabel sx={{ width: "100%" }}>{ strings.draftEditorScreen.editor.fields.staticFields }</FormLabel>
      { renderFieldDraggable(MetaformFieldType.Html, strings.draftEditorScreen.editor.fields.html, "html") }
      <FormLabel sx={{ width: "100%" }}>{ strings.draftEditorScreen.editor.fields.selectorFields }</FormLabel>
      { renderFieldDraggable(MetaformFieldType.Boolean, strings.draftEditorScreen.editor.fields.boolean, "checkbox") }
      { renderFieldDraggable(MetaformFieldType.Select, strings.draftEditorScreen.editor.fields.select, "expand_circle_down") }
      { renderFieldDraggable(MetaformFieldType.Slider, strings.draftEditorScreen.editor.fields.slider, "linear_scale") }
      { renderFieldDraggable(MetaformFieldType.Checklist, strings.draftEditorScreen.editor.fields.checklist, "fact_check") }
      { renderFieldDraggable(MetaformFieldType.Radio, strings.draftEditorScreen.editor.fields.radio, "radio_button_checked") }
      <FormLabel sx={{ width: "100%" }}>{ strings.draftEditorScreen.editor.fields.inputFields }</FormLabel>
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
        <Tooltip title={ strings.draftEditorScreen.editor.form.tooltipDescription }>
          <Tab
            value={ 0 }
            label={ strings.draftEditorScreen.editor.form.tabTitle }
          />
        </Tooltip>
        <Tooltip title={ strings.draftEditorScreen.editor.fields.tooltipDescription }>
          <Tab
            value={ 1 }
            label={ strings.draftEditorScreen.editor.fields.tabTitle }
          />
        </Tooltip>
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