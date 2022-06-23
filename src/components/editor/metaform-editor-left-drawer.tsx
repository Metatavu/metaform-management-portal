import { Tab, Tabs } from "@mui/material";
import TabPanel from "components/generic/tab-panel";
import { Metaform } from "generated/client";
import React from "react";
import { EditorDrawer } from "styled/editor/metaform-editor";

/**
 * Component properties
 */
interface Props {
  pendingForm: Metaform;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Draft editor screen component
 */
const MetaformEditorLeftDrawer: React.FC<Props> = ({
  pendingForm,
  setPendingForm
}) => {
  const [ tabIndex, setTabIndex ] = React.useState(0);

  console.log(pendingForm);
  console.log(setPendingForm);

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
          label="TODO"
        />
        <Tab
          value={ 1 }
          label="TODO"
        />
      </Tabs>
      <TabPanel value={ tabIndex } index={ 0 }/>
      <TabPanel value={ tabIndex } index={ 1 }/>
    </EditorDrawer>
  );
};

export default MetaformEditorLeftDrawer;