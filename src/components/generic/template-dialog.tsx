import * as React from "react";
import strings from "../../localization/strings";
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

/**
 * Interface representing component properties
 */
interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (title: string) => void;
}

/**
 * React component displaying template input dialog
 */
const TemplateDialog: React.FC<Props> = ({
  open,
  onCancel,
  onSubmit
}) => {
  const [ input, setInput ] = useState("");

  /**
   * Event handler for input change
   *
   * @param event event
   */
  const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setInput(event.target.value);
  };

  /**
   * Event handler for input submit click
   */
  const onSendClick = () => {
    onSubmit(input);
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog open={ true } onClose={ onCancel }>
      <DialogTitle variant="h2">{ strings.templateDialog.title }</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p>
            { strings.templateDialog.text }
          </p>
        </DialogContentText>
        <TextField
          style={{ width: "100%" }}
          required={ true }
          label={ strings.templateDialog.input }
          onChange={ onInputChange }
        />
      </DialogContent>
      <DialogActions>
        <Button disableElevation variant="contained" onClick={ onCancel } color="secondary" autoFocus>
          { strings.generic.cancel }
        </Button>
        <Button onClick={ onSendClick } color="primary" disabled={!input}>
          { strings.generic.save }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateDialog;