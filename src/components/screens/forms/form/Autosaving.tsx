import { Alert, Snackbar } from "@mui/material";
import strings from "localization/strings";
import * as React from "react";

interface Props {
  autosaving: boolean;
}

/**
 * Autosaving alert
 */
const Autosaving: React.FC<Props> = ({
  autosaving
}) => {
  return (
    <Snackbar open={ autosaving }>
      <Alert severity="info">
        <span>
          {" "}
          { strings.formScreen.autosaving }
          {" "}
        </span>
      </Alert>
    </Snackbar>
  );
};

export default Autosaving;