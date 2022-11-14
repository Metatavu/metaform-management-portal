import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

/**
 * Styled public content wrapper component
 */
export const ContentWrapper = styled(Box, {
  label: "public-layout--content-wrapper"
})(({ theme }) => ({
  flex: 1,
  width: "100%",
  height: "100vh",
  display: "flex",
  overflow: "hidden",
  background: theme.palette.background.paper
}));

/**
 * Styled public content component
 */
export const Content = styled(Paper, {
  label: "public-layout--content"
})(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  width: "100%",
  height: "100%",
  boxShadow: "none",
  overflow: "hidden"
}));