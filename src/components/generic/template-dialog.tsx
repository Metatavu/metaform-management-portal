import * as React from "react";
import strings from "../../localization/strings";
import { useState } from "react";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

/**
 * Interface representing component properties
 */
interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (title: string) => void;
  checkTemplateNameIsUnique: (templateTitle: string) => Promise<boolean>;
}

/**
 * React component displaying template input dialog
 */
const TemplateDialog: React.FC<Props> = ({
  open,
  onCancel,
  onSubmit,
  checkTemplateNameIsUnique
}) => {
  const [ input, setInput ] = useState("");
  const [ validationError, setValidationError ] = useState(false);
  const [ loading, setLoading ] = useState(false);

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
  const onSendClick = async () => {
    setLoading(true);
    const isUnique = await checkTemplateNameIsUnique(input);
    if (!isUnique) {
      setValidationError(true);
      setLoading(false);
      return;
    }
    setValidationError(false);
    onSubmit(input);
    setLoading(false);
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog open={ true } onClose={ onCancel }>
      <DialogTitle variant="h2">{ strings.templateDialog.title }</DialogTitle>
      <DialogContent>
        <DialogContentText>
          { strings.templateDialog.text }
        </DialogContentText>
        <TextField
          style={{ width: "100%" }}
          required={ true }
          label={ strings.templateDialog.input }
          onChange={ onInputChange }
        />
        {validationError &&
        <DialogContentText sx={{ color: "#FF0000" }}>
          { strings.templateDialog.unique }
        </DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button disableElevation variant="contained" onClick={ onCancel } color="secondary" autoFocus>
          { strings.generic.cancel }
        </Button>
        <Button onClick={ onSendClick } color="primary" disabled={!input.trim()}>
          { loading ? <CircularProgress/> : strings.generic.save }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateDialog;