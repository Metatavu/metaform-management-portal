/* eslint-disable jsx-a11y/anchor-is-valid */
import { Alert, Link, Snackbar } from "@mui/material";
import strings from "localization/strings";
import * as React from "react";

interface Props {
  setDraftSaveVisible: (visible: boolean) => void;
  draftSaveVisible: boolean;
  saveDraft: () => Promise<void>;
}

/**
 * Draft save dialog
 */
const DraftSaveDialog: React.FC<Props> = ({
  setDraftSaveVisible,
  draftSaveVisible,
  saveDraft
}) => {
  return (
    <Snackbar open={ draftSaveVisible } onClose={ () => setDraftSaveVisible(false) }>
      <Alert onClose={ () => setDraftSaveVisible(false) } severity="info">
        <span>
          {" "}
          { strings.formScreen.saveDraft }
          {" "}
        </span>
        <Link href="#" onClick={ saveDraft }>
          {" "}
          { strings.formScreen.saveDraftLink }
          {" "}
        </Link>
      </Alert>
    </Snackbar>
  );
};

export default DraftSaveDialog;