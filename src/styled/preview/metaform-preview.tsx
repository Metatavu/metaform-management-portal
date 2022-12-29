/* eslint-disable import/prefer-default-export */
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
  background: theme.palette.secondary.main
}));