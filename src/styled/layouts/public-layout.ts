import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

/**
 * Styled content wrapper component
 */
export const ContentWrapper = styled(Box, {
  label: "public-layout--content-wrapper"
})(({ theme }) => ({
  flex: 1,
  width: "100%",
  display: "flex",
  padding: theme.spacing(4),
  overflow: "hidden",
  background: theme.palette.background.paper
}));

/**
 * Styled content component
 */
export const Content = styled(Paper, {
  label: "public-layout--content"
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