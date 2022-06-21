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
  background: "linear-gradient(180deg, #375AA3 0%, #4FA3DF 100%);"
}));

/**
 * Styled content component
 */
export const Content = styled(Stack, {
  label: "app-layout--content"
})(({ theme }) => ({
  flex: 1,
  width: "100%",
  minHeight: `calc(100vh - ${theme.spacing(64)}px)`
}));