import React from "react";
import { Root } from "styled/layouts/basic-layout";

/**
 * Snackbar message
 */
export interface SnackbarMessage {
  message: string;
  severity: "success" | "info" | "warning" | "error";
}

/**
 * Basic layout component
 *
 * @param props component properties
 */
const BasicLayout: React.FC = ({
  children
}) => {
  /**
   * Component render
   */
  return (
    <Root>
      { children }
    </Root>
  );
};

export default BasicLayout;