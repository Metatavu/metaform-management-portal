import React from "react";
import strings from "localization/strings";
import { Stack, Typography } from "@mui/material";
import { RoundActionButton } from "styled/generic/form";
import { HeaderToolbar } from "styled/layout-components/header";
import { Close, Share } from "@mui/icons-material";
import { PreviewHeaderRoot } from "styled/editor/metaform-editor";

/**
 * Metaform editor preview header component
 */
const MetaformEditorPreviewHeader: React.FC = () => {
  // TODO path argument for preview
  return (
    <PreviewHeaderRoot position="static">
      <HeaderToolbar>
        <Stack
          direction="row"
          spacing={ 3 }
          marginLeft="auto"
        >
          <RoundActionButton
            endIcon={ <Share/> }
            onClick={ () => document.exitFullscreen() }
          >
            <Typography>{ strings.draftEditorScreen.formPreview.shareLink }</Typography>
          </RoundActionButton>
          <RoundActionButton
            endIcon={ <Close/> }
            onClick={ () => document.exitFullscreen() }
          >
            <Typography>{ strings.draftEditorScreen.formPreview.exit }</Typography>
          </RoundActionButton>
        </Stack>
      </HeaderToolbar>
    </PreviewHeaderRoot>
  );
};

export default MetaformEditorPreviewHeader;