import { Tab, Tabs, Tooltip } from "@mui/material";
import TabPanel from "components/generic/tab-panel";
import { Metaform, MetaformMemberGroup } from "generated/client";
import strings from "localization/strings";
import React from "react";
import { EditorDrawer } from "styled/editor/metaform-editor";
import MetaFormRightDrawerFeature from "./metaform-editor-right-drawer-feature";
import MetaFormRightDrawerVisibility from "./metaform-editor-right-drawer-visibility";

/**
 * Component properties
 */
interface Props {
  memberGroups: MetaformMemberGroup[],
  sectionIndex?: number;
  fieldIndex?: number;
  pendingForm: Metaform;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Draft editor right drawer component
 */
const MetaformEditorRightDrawer: React.FC<Props> = ({
  memberGroups,
  sectionIndex,
  fieldIndex,
  pendingForm,
  setPendingForm
}) => {
  const [ tabIndex, setTabIndex ] = React.useState(0);

  /**
   * Component render
   */
  return (
    <EditorDrawer>
      <Tabs
        onChange={ (_, value: number) => setTabIndex(value) }
        value={ tabIndex }
      >
        <Tooltip title={ strings.draftEditorScreen.editor.features.tooltipDescription }>
          <Tab
            value={ 0 }
            label={ strings.draftEditorScreen.editor.features.tabTitle }
          />
        </Tooltip>
        <Tooltip title={ strings.draftEditorScreen.editor.visibility.tooltipDescription }>
          <Tab
            value={ 1 }
            label={ strings.draftEditorScreen.editor.visibility.tabTitle }
          />
        </Tooltip>
      </Tabs>
      <TabPanel value={ tabIndex } index={ 0 }>
        <MetaFormRightDrawerFeature
          memberGroups={ memberGroups }
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
      </TabPanel>
    </EditorDrawer>
  );
};

export default MetaformEditorRightDrawer;