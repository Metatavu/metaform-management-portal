import { AlertTitle, Button, Link, Typography } from "@mui/material";
import GenericSnackbar from "components/generic/generic-snackbar";
import strings from "localization/strings";
import React from "react";

interface Props {
  getReplyEditLink?: () => string | null;
  replySavedVisible: boolean;
  setReplySavedVisible: (status: boolean) => void;
  onReplyEmailLinkClick?: () => void;
}

/**
 * "Reply saved"-alert
 */
const ReplySaved: React.FC<Props> = ({
  getReplyEditLink,
  replySavedVisible,
  setReplySavedVisible,
  onReplyEmailLinkClick
}) => {
  const replyEditLink = getReplyEditLink && getReplyEditLink();

  if (replyEditLink) {
    return (
      <GenericSnackbar
        open={ replySavedVisible }
        onClose={ () => setReplySavedVisible(false) }
        severity="success"
        disableClickaway
      >
        <>
          <Typography>{ strings.formScreen.replySaved }</Typography>
          <Typography>{ strings.formScreen.replyEdit }</Typography>
          <Link href={ replyEditLink }>{ replyEditLink }</Link>
          <Typography>{ strings.formScreen.replyEditEmailText }</Typography>
          <Button variant="text" onClick={ onReplyEmailLinkClick }>{ strings.formScreen.replyEditEmailLink }</Button>
        </>
      </GenericSnackbar>
    );
  }
  return (
    <GenericSnackbar
      open={ replySavedVisible }
      onClose={ () => setReplySavedVisible(false) }
      severity="success"
      autoHideDuration={ 5000 }
    >
      <AlertTitle>
        { strings.formScreen.replySaved }
      </AlertTitle>
    </GenericSnackbar>
  );
};

export default ReplySaved;