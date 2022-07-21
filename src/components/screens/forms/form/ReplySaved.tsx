/* eslint-disable jsx-a11y/anchor-is-valid */
import { Alert, Link, Snackbar } from "@mui/material";
import strings from "localization/strings";
import * as React from "react";

interface Props {
  getReplyEditLink: () => string | null;
  replySavedVisible: boolean;
  setReplySavedVisible: (status: boolean) => void;
  onReplyEmailLinkClick: () => void;

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
  const replyEditLink = getReplyEditLink();

  if (replyEditLink) {
    return (
      <Snackbar open={ replySavedVisible } onClose={ () => setReplySavedVisible(false) } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={ () => setReplySavedVisible(false) } severity="success">
          <span>
            {" "}
            { strings.formScreen.replySaved }
            {" "}
          </span>
          <p>
            {" "}
            { strings.formScreen.replyEdit }
            {" "}
          </p>
          <div style={{
            textOverflow: "ellipsis", overflow: "hidden", maxWidth: "50vw", whiteSpace: "nowrap"
          }}
          >
            <a href={ replyEditLink }>
              {" "}
              { replyEditLink }
              {" "}
            </a>
          </div>
          <p>
            { strings.formScreen.replyEditEmailText }
            <Link href="#" onClick={ onReplyEmailLinkClick }>
              {" "}
              { strings.formScreen.replyEditEmailLink }
              {" "}
            </Link>
          </p>
        </Alert>
      </Snackbar>
    );
  }
  return (
    <Snackbar open={ replySavedVisible } onClose={ () => setReplySavedVisible(false) } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={ () => setReplySavedVisible(false) } severity="success">
        <span>
          {" "}
          { strings.formScreen.replySaved }
          {" "}
        </span>
      </Alert>
    </Snackbar>
  );
};

export default ReplySaved;