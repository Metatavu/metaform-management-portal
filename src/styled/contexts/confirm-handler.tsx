import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";

/**
 * Styled loader container component
 */
export const LoaderContainer = styled("div", {
  label: "confirm-handler--loader-container"
})(() => ({
  width: "100%",
  height: "100%",
  display: "grid",
  placeItems: "center"
}));

/**
 * Styled dialog header component
 */
export const DialogHeader = styled(DialogTitle, {
  label: "confirm-handler--dialog-header"
})(() => ({
  display: "flex",
  justifyContent: "space-between",
  fontSize: 24
}));