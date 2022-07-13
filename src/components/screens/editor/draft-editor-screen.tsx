import { Divider, Stack, Typography } from "@mui/material";
import { Metaform } from "generated/client";
import React from "react";
import MetaformUtils from "utils/form-editor-utils";
import MetaformEditor from "components/editor/metaform-editor";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import { Preview, Public, Save } from "@mui/icons-material";
import { IconActionButton } from "styled/layouts/admin-layout";

/**
 * Draft editor screen component
 */
const DraftEditorScreen: React.FC = () => {
  // TODO draft fetch, set logic, replace the example form
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [ draftForm, setDraftForm ] = React.useState<Metaform>(MetaformUtils.jsonToMetaform({}));

  /**
   * Renders draft editor actions
   */
  const draftEditorActions = () => (
    <Stack direction="row" spacing={ 2 }>
      <IconActionButton disabled startIcon={ <Save/> }>
        <Typography>{ strings.generic.save }</Typography>
      </IconActionButton>
      <IconActionButton onClick={ () => editorRef.current?.requestFullscreen?.() } startIcon={ <Preview/> }>
        <Typography>{ strings.draftEditorScreen.preview }</Typography>
      </IconActionButton>
      <IconActionButton disabled startIcon={ <Public/> }>
        <Typography>{ strings.draftEditorScreen.publish }</Typography>
      </IconActionButton>
    </Stack>
  );

  return (
    <Stack flex={ 1 } overflow="hidden">
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.editorScreens.draftEditorScreen }
          renderActions={ draftEditorActions }
        />
      </NavigationTabContainer>
      <Divider/>
      <MetaformEditor
        editorRef={ editorRef }
        pendingForm={ draftForm }
        setPendingForm={ setDraftForm }
      />
    </Stack>
  );
};

export default DraftEditorScreen;