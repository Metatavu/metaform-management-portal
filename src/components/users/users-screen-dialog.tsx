import { HelpOutline } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import theme from "theme";

/**
 * Interface representing component properties
 */
interface Props {
  open: boolean;
  dialogTitle: string;
  dialogDescription: string;
  helperIcon?: boolean;
  tooltipText?: string | JSX.Element;
  dialogContent: JSX.Element;
  dialogActions: JSX.Element;
  onCancel: () => void;
}

/**
 * React component for generic dialog used in Users screen
 */
const UsersScreenDialog: React.FC<Props> = ({
  open,
  dialogTitle,
  dialogDescription,
  helperIcon,
  tooltipText,
  dialogContent,
  dialogActions,
  onCancel
}) => {
  const [ helperTooltipOpen, setHelperTooltipOpen ] = useState<boolean>(false);

  if (!open) {
    return null;
  }

  /**
   * Event handler for help icon
   */
  const handleHelpIconClick = () => setHelperTooltipOpen(!helperTooltipOpen);

  /**
   * Renders helper icon
   */
  const renderHelperIcon = () => {
    if (!helperIcon || !tooltipText) {
      return;
    }

    return (
      <Tooltip open={ helperTooltipOpen } title={ tooltipText } placement="top">
        <IconButton
          onClick={ handleHelpIconClick }
        >
          <HelpOutline/>
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Dialog
      open={ open }
      onClose={ onCancel }
    >
      <DialogTitle variant="h2">
        { dialogTitle }
      </DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <DialogContentText
          variant="body1"
          color={ theme.palette.text.secondary }
          sx={{ paddingBottom: 2 }}
        >
          { dialogDescription }
          { renderHelperIcon() }
        </DialogContentText>
        { dialogContent }
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 2 }}>
        { dialogActions }
      </DialogActions>
    </Dialog>
  );
};

export default UsersScreenDialog;