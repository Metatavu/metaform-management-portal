import { Stack } from "@mui/material";
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
export const Content = styled(Stack, {
  label: "app-layout--content"
})(({ theme }) => ({
  backgroundColor: "rgba(218,219,205,0.1)",
  flex: 1,
  width: "100%",
  minHeight: `calc(100vh - ${theme.spacing(64)}px)`
}));