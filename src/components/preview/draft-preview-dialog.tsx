import * as React from "react";
import { useState } from "react";
import { Alert, Dialog, DialogContent, DialogTitle, IconButton, Snackbar, Stack, TextField, Typography } from "@mui/material";
import strings from "localization/strings";
import { RoundActionButton } from "styled/generic/form";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

/**
 * Interface representing component properties
 */
interface Props {
  open: boolean;
  onCancel: () => void;
  linkToShare: string;
}

/**
 * React component for add member dialog
 */
const DraftPreviewShareDialog: React.FC<Props> = ({
  open,
  onCancel,
  linkToShare
}) => {
  const [ email, setEmail ] = useState("");
  const [ linkCopied, setLinkCopied ] = useState(false);

  /**
   * On copy click handler
   */
  const onCopyClick = async () => {
    await navigator.clipboard.writeText(linkToShare);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1000);
  };

  /**
   * Renders link copied snackbar
   */
  const renderSnackbar = () => (
    <Snackbar
      open={ linkCopied }
      onClose={ () => setLinkCopied(false) }
    >
      <Alert severity="info">
        <span>
          {" "}
          { strings.draftEditorScreen.formPreview.shareLinkDialog.linkCopied }
          {" "}
        </span>
      </Alert>
    </Snackbar>
  );

  /**
   * Renders dialog
   */
  const renderDialog = () => (
    <Dialog open={ true } onClose={ onCancel }>
      <DialogTitle variant="h2">{ strings.draftEditorScreen.formPreview.shareLinkDialog.title }</DialogTitle>
      <DialogContent style={{ width: 500 }}>
        <Typography variant="body1" style={{ paddingBottom: 16 }}>
          { strings.draftEditorScreen.formPreview.shareLinkDialog.text }
        </Typography>
        <Stack spacing={ 1 }>
          <Stack
            spacing={ 1 }
            direction="row"
          >
            <TextField
              fullWidth
              size="medium"
              required={ true }
              value={ email }
              type="email"
              name="email"
              label={ strings.draftEditorScreen.formPreview.shareLinkDialog.recipients }
              onChange={ ({ target }) => setEmail(target.value) }
            />
            <RoundActionButton disabled>
              <Typography>{ strings.draftEditorScreen.formPreview.shareLinkDialog.send }</Typography>
            </RoundActionButton>
          </Stack>
          <Stack>
            <Typography sx={{ fontWeight: 600 }}>{ strings.draftEditorScreen.formPreview.shareLinkDialog.link }</Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">{ linkToShare }</Typography>
              <IconButton
                onClick={ onCopyClick }
              >
                <ContentCopyIcon/>
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );

  if (!open) {
    return (
      <>
        { renderSnackbar() }
      </>
    );
  }

  return (
    <>
      { renderDialog() }
      { renderSnackbar() }
    </>
  );
};

export default DraftPreviewShareDialog;