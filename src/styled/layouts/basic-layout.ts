import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import theme from "theme";

/**
 * Styled root component
 */
export const Root = styled(Box, {
  label: "basic-layout--root"
})(() => ({
  height: "100vh",
  width: "100vw",
  overflow: "scroll",
  display: "grid",
  gridTemplateRows: "auto auto auto 1fr",
  background: theme.palette.background.default
}));

export default Root;