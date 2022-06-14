import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";

/**
 * Styled dialog title component
 */
export const DialogHeader = styled(DialogTitle, {
  label: "generic-dialog--dialog-header"
})(() => ({
  display: "flex",
  justifyContent: "space-between",
  fontSize: 24
}));

/**
 * Styled loader container component
 */
export const LoaderContainer = styled("div", {
  label: "generic-dialog--loader-container"
})(() => ({
  width: "100%",
  height: "100%",
  display: "grid",
  placeItems: "center"
}));