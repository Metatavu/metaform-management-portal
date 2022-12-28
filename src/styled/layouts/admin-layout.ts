import { Paper, FormControl } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

/**
 * Styled admin content wrapper component
 */
export const ContentWrapper = styled(Box, {
  label: "admin-layout--content-wrapper"
})(({ theme }) => ({
  flex: 1,
  width: "100%",
  display: "flex",
  padding: theme.spacing(4),
  overflow: "hidden",
  background: theme.palette.background.default
}));

/**
 * Styled form control component
 */
export const FormFilterWrapper = styled(FormControl, {
  label: "admin-layout--form-filter-wrapper"
})(() => ({
  display: "flex",
  flexDirection: "row",
  gap: "0.5rem",
  padding: "1rem",
  borderTop: "0.5px solid #ccc",
  borderBottom: "0.5px solid #ccc"
}));

/**
 * Styled admin content component
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