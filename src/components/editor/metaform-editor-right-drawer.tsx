import { Divider, Tab, Tabs } from "@mui/material";
import TabPanel from "components/generic/tab-panel";
import { Metaform } from "generated/client";
import strings from "localization/strings";
import React from "react";
import { EditorDrawer } from "styled/editor/metaform-editor";
import MetaFormRightDrawerFeature from "./metaform-editor-right-drawer-feature";
import MetaFormRightDrawerVisibility from "./metaform-editor-right-drawer-visibility";

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
  console.log(pendingForm);
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
          label={ strings.draftEditorScreen.editor.features.tabTitle }
        />
        <Tab
          value={ 1 }
          label={ strings.draftEditorScreen.editor.visibility.tabTitle }
        />
      </Tabs>
      <TabPanel value={ tabIndex } index={ 0 }>
        <MetaFormRightDrawerFeature
          pendingForm={ pendingForm }
          setPendingForm={ setPendingForm }
          fieldIndex={ fieldIndex }
          sectionIndex={ sectionIndex }
        />
      </TabPanel>

      <TabPanel value={ tabIndex } index={ 1 }>
        <MetaFormRightDrawerVisibility
          pendingForm={ pendingForm }
          setPendingForm={ setPendingForm }
          fieldIndex={ fieldIndex }
          sectionIndex={ sectionIndex }
        />
        <Divider/>
      </TabPanel>
    </EditorDrawer>
  );
};

export default MetaformEditorRightDrawer;