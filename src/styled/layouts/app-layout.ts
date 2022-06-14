import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

/**
 * Styled root component
 */
export const Root = styled(Box, {
  label: "app-layout--root"
})(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  backgroundColor: theme.palette.background.default
}));

/**
 * Styled content component
 */
export const Content = styled(Box, {
  label: "app-layout--content"
})(({ theme }) => ({
  backgroundColor: "rgba(218,219,205,0.1)",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  width: "100%",
  minHeight: `calc(100vh - ${theme.spacing(64)}px)`
}));