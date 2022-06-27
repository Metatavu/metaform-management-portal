import { Divider, Stack, Typography } from "@mui/material";
import { Metaform } from "generated/client";
import React from "react";
import MetaformUtils from "utils/metaform-utils";
import exampleForm from "resources/forms/form.example.json";
import MetaformEditor from "components/editor/metaform-editor";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import { Preview, Public, Save } from "@mui/icons-material";
import { IconActionButton } from "styled/layouts/app-layout";

/**
 * Draft editor screen component
 */
const DraftEditorScreen: React.FC = () => {
  // TODO draft fetch, set logic, replace the example form
  const [ draftForm, setDraftForm ] = React.useState<Metaform>(MetaformUtils.jsonToMetaform(exampleForm));

  /**
   * Renders draft editor actions
   */
  const draftEditorActions = () => (
    <Stack direction="row" spacing={ 2 }>
      <IconActionButton disabled startIcon={ <Save/> }>
        <Typography>{ strings.generic.save }</Typography>
      </IconActionButton>
      <IconActionButton onClick={ () => {} } startIcon={ <Preview/> }>
        <Typography>{ strings.draftEditorScreen.preview }</Typography>
      </IconActionButton>
      <IconActionButton disabled startIcon={ <Public/> }>
        <Typography>{ strings.draftEditorScreen.publish }</Typography>
      </IconActionButton>
    </Stack>
  );

  return (
    <Stack overflow="hidden">
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.editorScreens.draftEditorScreen }
          renderActions={ draftEditorActions }
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