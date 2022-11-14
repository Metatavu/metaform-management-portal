import React from "react";
import strings from "localization/strings";
import { Stack, Typography } from "@mui/material";
import { RoundActionButton } from "styled/generic/form";
import { HeaderToolbar } from "styled/layout-components/header";
import { Close, Share } from "@mui/icons-material";
import { PreviewHeaderRoot } from "styled/preview/metaform-preview";
import { useNavigate } from "react-router-dom";

interface Prop {
  onShareLinkClick: () => void;
}

/**
 * Metaform editor preview header component
 */
const DraftPreviewHeader: React.FC<Prop> = ({
  onShareLinkClick
}) => {
  const navigate = useNavigate();

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
            onClick={ onShareLinkClick }
          >
            <Typography>{ strings.draftEditorScreen.formPreview.shareLink }</Typography>
          </RoundActionButton>
          <RoundActionButton
            endIcon={ <Close/> }
            onClick={ () => navigate(window.location.pathname.replace("preview", "editor")) }
          >
            <Typography>{ strings.draftEditorScreen.formPreview.exit }</Typography>
          </RoundActionButton>
        </Stack>
      </HeaderToolbar>
    </PreviewHeaderRoot>
  );
};

export default DraftPreviewHeader;