import { Divider, Stack } from "@mui/material";
import { Metaform } from "generated/client";
import React from "react";
import MetaformUtils from "utils/metaform";
import exampleForm from "resources/forms/form.example.json";
import MetaformEditor from "components/editor/metaform-editor";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";

/**
 * Draft editor screen component
 */
const DraftEditorScreen: React.FC = () => {
  // TODO draft fetch, set logic, replace the example form
  const [ draftForm, setDraftForm ] = React.useState<Metaform>(MetaformUtils.ObjectToMetaform(exampleForm));

  return (
    <Stack overflow="hidden">
      <NavigationTabContainer>
        <NavigationTab
          text={{ title: "aaa", description: "aaa" }}
        />
      </NavigationTabContainer>
      <Divider/>
      <MetaformEditor
        pendingForm={ draftForm }
        setPendingForm={ setDraftForm }
      />
    </Stack>
  );
};

export default DraftEditorScreen;