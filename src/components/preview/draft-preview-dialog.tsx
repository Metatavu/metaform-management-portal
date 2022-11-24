import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import strings from "localization/strings";
import { RoundActionButton } from "styled/generic/form";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Mail from "mail/mail";
import { ErrorContext } from "components/contexts/error-handler";
import isEmail from "validator/lib/isEmail";
import Config from "app/config";

/**
 * Interface representing component properties
 */
interface Props {
  open: boolean;
  linkToShare: string;
  formTitle: string;
  onCancel: () => void;
  setEmailSent: (emailSent: boolean) => void;
  setLinkCopied: (emailSent: boolean) => void;
}

/**
 * React component for add member dialog
 */
const DraftPreviewShareDialog: React.FC<Props> = ({
  open,
  onCancel,
  linkToShare,
  setEmailSent,
  setLinkCopied,
  formTitle
}) => {
  const [ email, setEmail ] = useState("");
  const errorContext = React.useContext(ErrorContext);

  /**
   * On copy click handler
   */
  const onCopyClick = async () => {
    await navigator.clipboard.writeText(linkToShare);
    setLinkCopied(true);
  };

  /**
   * On send email click handler
   */
  const onSendEmailClick = async () => {
    try {
      Mail.sendMail({
        from: Config.getEmailFrom(),
        to: email,
        html: (strings.formatString(strings.draftEditorScreen.formPreview.previewEmail.content, formTitle, linkToShare)) as string,
        subject: (strings.formatString(strings.draftEditorScreen.formPreview.previewEmail.subject, formTitle)) as string
      });

      setEmailSent(true);
      setEmail("");
    } catch (error) {
      errorContext.setError(strings.errorHandling.previewScreen.shareLink, error);
    }
  };

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
            <RoundActionButton
              disabled={ !isEmail(email) }
              onClick={ onSendEmailClick }
            >
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
    return null;
  }

  return (
    <>
      { renderDialog() }
    </>
  );
};

export default DraftPreviewShareDialog;