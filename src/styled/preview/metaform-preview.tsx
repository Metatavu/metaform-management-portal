import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Styled preview header root component
 */
export const PreviewHeaderRoot = styled(Box, {
  label: "preview-header--root"
})(({ theme }) => ({
  width: "100vw",
  overflow: "auto",
  padding: theme.spacing(1),
  background: theme.palette.secondary.main,
  boxShadow: "0px 2px 1px rgba(0,0,0,0.5)"
}));

/**
 * Styled preview layout component
 */
export const PreviewLayout = styled(Box, {
  label: "preview-layout"
})(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  overflow: "auto",
  display: "grid",
  gridTemplateRows: "auto auto auto 1fr",
  backgroundColor: theme.palette.grey[300]
}));