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
  height: theme.spacing(5),
  borderRadius: theme.spacing(1),
  border: "0.06em solid #ccc",
  padding: theme.spacing(2),
  minWidth: 400,
  flex: 1
}));

/**
 * Styled form control component
 */
export const FormFilterWrapper = styled(FormControl, {
  label: "admin-layout--form-filter-wrapper"
})(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: "0.5rem",
  padding: theme.spacing(1),
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
 * Styled new user button component
 */
export const NewUserButton = styled(Button, {
  label: "new-button"
})(({ theme }) => ({
  borderRadius: "1em",
  fontWeight: "bold",
  height: "fit-content",
  padding: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
  alignSelf: "center",
  marginRight: theme.spacing(2)
}));

/**
 * Styled new member group button component
 */
export const NewMemberGroupButton = styled(Button, {
  label: "new-button"
})(({ theme }) => ({
  borderRadius: "1em",
  fontWeight: "bold",
  height: "fit-content",
  padding: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
  alignSelf: "center",
  marginRight: theme.spacing(2)
}));