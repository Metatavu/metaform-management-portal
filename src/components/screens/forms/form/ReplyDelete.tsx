/* eslint-disable jsx-a11y/anchor-is-valid */
import { Alert, Link, Snackbar } from "@mui/material";
import strings from "localization/strings";
import * as React from "react";

interface Props {
  replyDeleteVisible: boolean;
  setReplyDeleteVisible: (visible: boolean) => void;
  setReplyConfirmVisible: (visible: boolean) => void;
}

/**
 * Reply delete alert
 */
const ReplyDelete: React.FC<Props> = ({
  replyDeleteVisible,
  setReplyDeleteVisible,
  setReplyConfirmVisible
}) => {
  return (
    <Snackbar open={ replyDeleteVisible } onClose={ () => setReplyDeleteVisible(false) }>
      <Alert onClose={ () => setReplyDeleteVisible(false) } severity="warning">
        <span>
          {" "}
          { strings.formScreen.replyDeleteText }
          {" "}
        </span>
        <Link href="#" onClick={ () => setReplyConfirmVisible(true) }>
          {" "}
          { strings.formScreen.replyDeleteLink }
          {" "}
        </Link>
      </Alert>
    </Snackbar>
  );
};

export default ReplyDelete;