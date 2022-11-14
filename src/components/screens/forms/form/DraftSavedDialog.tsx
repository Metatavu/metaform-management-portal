import { Button, Link, Typography } from "@mui/material";
import GenericSnackbar from "components/generic/generic-snackbar";
import strings from "localization/strings";
import React from "react";

interface Props {
  setDraftSavedVisible: (visible: boolean) => void;
  draftSavedVisible: boolean;
  getDraftLink: () => string | null;
  onDraftEmailLinkClick: () => void;
}

/**
 * Draft save dialog
 */
const DraftSavedDialog: React.FC<Props> = ({
  setDraftSavedVisible,
  draftSavedVisible,
  getDraftLink,
  onDraftEmailLinkClick
}) => {
  const draftLink = getDraftLink();

  if (!draftLink) {
    return null;
  }

  return (
    <GenericSnackbar
      open={ draftSavedVisible }
      onClose={ () => setDraftSavedVisible(false) }
      severity="success"
      disableClickaway
    >
      <>
        <Typography>{ strings.formScreen.draftSaved }</Typography>
        <Link href={ draftLink }>{ draftLink }</Link>
        <Typography>{ strings.formScreen.draftEmailText }</Typography>
        <Button variant="text" onClick={ onDraftEmailLinkClick}>{ strings.formScreen.draftEmailLink }</Button>
      </>
    </GenericSnackbar>
  );
};

export default DraftSavedDialog;