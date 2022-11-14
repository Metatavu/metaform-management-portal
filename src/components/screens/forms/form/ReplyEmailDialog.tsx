import EmailDialog from "components/generic/email-dialog";
import strings from "localization/strings";
import * as React from "react";

interface Props {
  replyEmailDialogVisible: boolean;
  setReplyEmailDialogVisible: (visible: boolean) => void;
  sendReplyEmail: (email: string) => void;
}

/**
 * Reply email dialog
 */
const ReplyEmailDialog: React.FC<Props> = ({
  replyEmailDialogVisible,
  setReplyEmailDialogVisible,
  sendReplyEmail
}) => {
  return (
    <EmailDialog
      text={ strings.formScreen.replyEditEmailDialogText }
      open={ replyEmailDialogVisible }
      onSend={ sendReplyEmail }
      onCancel={ () => setReplyEmailDialogVisible(false) }
    />
  );
};

export default ReplyEmailDialog;