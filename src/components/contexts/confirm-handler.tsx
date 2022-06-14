import { Button, CircularProgress, Dialog, DialogActions, DialogContent, IconButton, Typography } from "@mui/material";
import strings from "localization/strings";
import React from "react";
import { DialogHeader } from "styled/generic/generic-dialog";
import type { ConfirmContextType, ConfirmOptions } from "types";
import CloseIcon from "@mui/icons-material/Close";
import { LoaderContainer } from "styled/contexts/confirm-handler";

/**
 * Confirm context initialization
 */
export const ConfirmContext = React.createContext<ConfirmContextType>({ confirm: () => {} });

/**
 * Confirm handler component
 *
 * @param props component properties
 */
const ConfirmHandler: React.FC = ({ children }) => {
  const [ currentOperation, setCurrentOperation ] = React.useState<() => any>();
  const [ currentOptions, setCurrentOptions ] = React.useState<ConfirmOptions>();
  const [ loading, setLoading ] = React.useState(false);
  const [ open, setOpen ] = React.useState(false);

  const {
    title,
    description,
    onCancel,
    onConfirm
  } = currentOptions || {};

  /**
   * Ask confirmation
   *
   * @param operation operation to confirm
   * @param options confirmation options
   */
  const confirm = (operation: () => any, options: ConfirmOptions) => {
    setCurrentOptions(options);
    setCurrentOperation(operation);
    setOpen(true);
  };

  /**
   * Handler for closing dialog
   */
  const handleClose = () => {
    setOpen(false);

    setTimeout(() => {
      setLoading(false);
      setCurrentOperation(undefined);
      setCurrentOptions(undefined);
    }, 500);
  };

  /**
   * Handler for confirm action
   */
  const confirmed = async () => {
    setLoading(true);

    await currentOperation?.();

    onConfirm?.();
    handleClose();
  };

  /**
   * Handler for cancel action
   */
  const cancelled = () => {
    onCancel?.();
    handleClose();
  };

  /**
   * Renders dialog contents
   */
  const renderDialogContents = () => {
    if (loading) {
      return (
        <LoaderContainer>
          <CircularProgress color="secondary"/>
        </LoaderContainer>
      );
    }

    return (
      <Typography>
        { description }
      </Typography>
    );
  };

  /**
   * Memoized context value
   */
  const contextValue = React.useMemo(() => ({
    confirm: confirm
  }), []);

  /**
   * Component render
   */
  return (
    <ConfirmContext.Provider value={ contextValue }>
      { children }
      <Dialog
        open={ open }
        onClose={ handleClose }
        PaperProps={{ sx: { minWidth: 400 } }}
      >
        <DialogHeader>
          { title }
          <IconButton
            size="small"
            onClick={ cancelled }
            disabled={ loading }
          >
            <CloseIcon/>
          </IconButton>
        </DialogHeader>
        <DialogContent>
          { renderDialogContents() }
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            disabled={ loading }
            onClick={ cancelled }
          >
            { strings.generic.cancel }
          </Button>
          <Button
            color="primary"
            disabled={ loading }
            onClick={ confirmed }
            autoFocus
          >
            { strings.generic.delete }
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
};

export default ConfirmHandler;