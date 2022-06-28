import { Button, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

/**
 * Styled content wrapper component
 */
export const ContentWrapper = styled(Box, {
  label: "admin-layout--content-wrapper"
})(({ theme }) => ({
  flex: 1,
  width: "100%",
  display: "flex",
  padding: theme.spacing(4),
  overflow: "hidden",
  background: "linear-gradient(180deg, #375AA3 0%, #4FA3DF 100%)"
}));

/**
 * Styled content component
 */
export const Content = styled(Paper, {
  label: "admin-layout--content"
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  width: "100%",
  height: "100%",
  borderRadius: theme.spacing(4),
  boxShadow: "none",
  overflow: "hidden"
}));

/**
 * Styled icon action button component
 */
export const IconActionButton = styled(Button, {
  label: "icon-action-button"
})(({ theme }) => ({
  borderRadius: 25,
  padding: theme.spacing(1.5)
}));