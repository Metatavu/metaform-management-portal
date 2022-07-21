import { Button, Paper, NativeSelect, FormControl } from "@mui/material";
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
  background: "transparent"
}));

/**
 * Styled admin selector component
 */
export const FilterSelector = styled(NativeSelect, {
  label: "admin-layout--filter-selector"
})(({ theme }) => ({
  width: "30%",
  marginRight: "10px",
  height: theme.spacing(5),
  borderRadius: theme.spacing(1),
  border: "0.06em solid #ccc",
  padding: theme.spacing(2)
}));

/**
 * Styled form control component
 */
export const FormFilterWrapper = styled(FormControl, {
  label: "admin-layout--form-filter-wrapper"
})(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  BorderRadius: theme.spacing(2),
  width: "100%",
  padding: theme.spacing(2)
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

/**
 * Styled icon action button component
 */
export const IconActionButton = styled(Button, {
  label: "icon-action-button"
})(({ theme }) => ({
  borderRadius: 25,
  padding: theme.spacing(1.5)
}));

/**
 * Styled new button component
 */
export const NewButton = styled(Button, {
  label: "new-button"
})(() => ({
  borderRadius: "1em",
  margin: "2em",
  fontWeight: "bold"
}));