import * as React from "react";

import strings from "../../localization/strings";
import * as EmailValidator from "email-validator";
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

/**
 * Interface representing component properties
 */
interface Props {
  open: boolean;
  text: string;
  onCancel: () => void;
  onSend: (email: string) => void;
}

/**
 * React component displaying email input dialogs
 */
const EmailDialog: React.FC<Props> = ({
  open,
  text,
  onCancel,
  onSend
}) => {
  const [ email, setEmail ] = useState("");

  /**
   * Event handler for email change
   * 
   * @param event event
   */
  const onEmailChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  /**
   * Event handler for email send click
   */
  const onSendClick = () => {
    onSend(email);
  };
  
  if (!open) {
    return null;
  }

  return (
    <Dialog open={ true } onClose={ onCancel }>
      <DialogTitle>{ strings.emailDialog.title }</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p>
            { text }
          </p>
        </DialogContentText>
        <TextField
          style={{ width: "100%" }}
          required={ true }
          label={ strings.emailDialog.email }
          type="email"
          onChange={ onEmailChange }
        />
      </DialogContent>
      <DialogActions>
        <Button disableElevation variant="contained" onClick={ onCancel } color="secondary" autoFocus>
          { strings.emailDialog.cancel }
        </Button>
        <Button onClick={ onSendClick } color="primary" disabled={ !EmailValidator.validate(email) }>
          { strings.emailDialog.send }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailDialog;