/* eslint-disable jsx-a11y/anchor-is-valid */
import { Alert, Link, Snackbar } from "@mui/material";
import strings from "localization/strings";
import * as React from "react";

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
    <Snackbar open={ draftSavedVisible } onClose={ () => setDraftSavedVisible(false) } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={ () => setDraftSavedVisible(false) } severity="success">
        <span>
          {" "}
          { strings.formScreen.draftSaved }
          {" "}
        </span>
        <br/>
        <br/>
        <a href={ draftLink }>
          {" "}
          { draftLink }
          {" "}
        </a>
        <p>
          { strings.formScreen.draftEmailText }
          <Link href="#" onClick={ onDraftEmailLinkClick }>
            {" "}
            { strings.formScreen.draftEmailLink }
            {" "}
          </Link>
        </p>
      </Alert>
    </Snackbar>
  );
};

export default DraftSavedDialog;