import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

/**
 * Styled root component
 */
export const Root = styled(Box, {
  label: "app-layout--root"
})(() => ({
  height: "100vh",
  width: "100vw",
  overflow: "hidden"
}));

/**
 * Styled content wrapper component
 */
export const ContentWrapper = styled(Box, {
  label: "app-layout--content-wrapper"
})(({ theme }) => ({
  flex: 1,
  width: "100%",
  padding: theme.spacing(4)
}));

/**
 * Styled content component
 */
export const Content = styled(Paper, {
  label: "app-layout--content"
})(({ theme }) => ({
  flex: 1,
  width: "100%",
  borderRadius: theme.spacing(4),
  boxShadow: "none",
  overflow: "hidden"
}));