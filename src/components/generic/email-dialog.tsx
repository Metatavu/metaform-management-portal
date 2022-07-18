/* eslint-disable */
import * as React from "react";

import strings from "../../localization/strings";
import * as EmailValidator from "email-validator";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";

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
 * Interface representing component state
 */
interface State {
  email: string;
}

/**
 * React component displaying email input dialogs
 */
export default class EmailDialog extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      email: ""
    };
  }

  /** 
   * Component render method
   */
  public render() {
    const { text, open } = this.props;

    if (!open) {
      return null;
    }

    return (
      <Dialog open={ true } onClose={ this.props.onCancel }>
        <DialogTitle>{ strings.emailDialog.title }</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>
              {" "}
              { text }
              {" "}
            </p>
          </DialogContentText>
          <TextField
            style={{ width: "100%" }}
            required={ true }
            label={ strings.emailDialog.email }
            type="email"
            onChange={ this.onEmailChange }
          />
        </DialogContent>
        <DialogActions>
          <Button disableElevation variant="contained" onClick={ this.props.onCancel } color="secondary" autoFocus>
            { strings.emailDialog.cancel }
          </Button>
          <Button onClick={ this.onSendClick } color="primary" disabled={ !EmailValidator.validate(this.state.email) }>
            { strings.emailDialog.send }
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  /**
   * Event handler for email change
   * 
   * @param event event
   */
  private onEmailChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({
      email: event.target.value
    });
  };

  /**
   * Event handler for email send click
   */
  private onSendClick = () => {
    this.props.onSend(this.state.email);
  };

}