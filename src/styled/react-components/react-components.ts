import { Slider, Box, TextField, Input, Autocomplete, Stack, Typography, Button, FormControl } from "@mui/material";
import { styled } from "@mui/material/styles";
import theme from "theme";

/**
 * Styled autocomplete field component
 */
export const HtmlAutocompleteWrapper = styled(Autocomplete, {
  label: "HtmlAutocompleteWrapper"
})(() => ({
  flex: 1,
  width: "100%",
  height: "auto;",
  borderRadius: "0.5em",
  border: "1px solid rgba(0, 0, 0, .5)",
  padding: "0.5rem 1rem"
}));

/**
 * Styled html field component
 */
export const HtmlFieldWrapper = styled(Box, {
  label: "html-field-wrapper"
})(() => ({
  flex: 1
}));

/**
 * Styled slider field component
 */
export const SliderFieldWrapper = styled(Slider, {
  label: "slider-field-wrapper"
})(() => ({
  width: "100%",
  height: "0.25em",
  color: theme.palette.primary.main
}));

/**
 * Styled submit field component
 */
export const SubmitFieldWrapper = styled(Button, {
  label: "submit-field-wrapper"
})(() => ({
  borderRadius: "0.5rem",
  border: 0,
  width: "100%",
  color: "#fff"
}));

/**
 * Styled add row button component
 */
export const AddRowButtonWrapper = styled(Button, {
  label: "add-row-button-wrapper"
})(() => ({
  borderRadius: "0.5rem",
  border: 0,
  width: "100%",
  color: "#fff",
  marginTop: "0.5rem"
}));

/**
 * Styled files row component
 */
export const FilesRowWrapper = styled(Stack, {
  label: "files-row-wrapper"
})(() => ({
  display: "flex",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  alignItems: "center",
  borderBottom: "1px dashed #aaa"
}));

/**
 * Styled files button component
 */
export const FilesButtonWrapper = styled(Button, {
  label: "files-button-wrapper"
})(() => ({
  borderRadius: "0.5rem",
  border: 0,
  flex: 0.5,
  color: "#fff"
}));

/**
 * Styled select field component
 */
export const SelectFieldWrapper = styled(FormControl, {
  label: "select-field-wrapper"
})(() => ({
  width: "100%",
  borderRadius: "0.5em",
  border: "1px solid rgba(0, 0, 0, .5)",
  maxHeight: 50,
  justifyContent: "center",
  overflow: "hidden"
}));

/**
 * Styled radio field component
 */
export const RadioFieldWrapper = styled(Box, {
  label: "radio-field-wrapper"
})(() => ({
  width: "100%"
}));

/*
 * Styled url field component
 */
export const UrlFieldWrapper = styled(Input, {
  label: "url-field-wrapper"
})(() => ({
  flex: 1,
  border: "1px solid rgba(0, 0, 0, .5)",
  borderRadius: "0.5rem",
  padding: "0.5rem 1rem"
}));

/**
 * Styled text field component
 */
export const TextFieldWrapper = styled(Input, {
  label: "text-field-wrapper"
})(() => ({
  flex: 1,
  width: "100%",
  border: "1px solid rgba(0, 0, 0, .5)",
  borderRadius: "0.5rem",
  backgroundColor: "#fff",
  padding: "0.5rem 1rem"
}));

/**
 * Styled memo field component
 */
export const MemoFieldWrapper = styled(TextField, {
  label: "memo-field-wrapper"
})(() => ({
  backgroundColor: "white",
  border: "1px solid rgba(0, 0, 0, .5)",
  borderRadius: "0.5rem",
  width: "100%",
  padding: "0.5rem 1rem",
  minHeight: "5rem"
}));

/**
 * Styled date field component
 */
export const DateFieldWrapper = styled(Box, {
  label: "date-field-wrapper"
})(() => ({
  flex: 1,
  width: "100%",
  height: "auto",
  border: "1px solid rgba(0, 0, 0, .5)",
  borderRadius: "0.5rem",
  minHeight: 50,
  display: "flex",
  alignItems: "center"
}));

/**
 * Styled number field component
 */
export const NumberFieldWrapper = styled(TextField, {
  label: "number-field-wrapper"
})(() => ({
  width: "100%",
  fontSize: "1em",
  border: "1px solid rgba(0, 0, 0, .5)",
  borderRadius: "0.5rem",
  padding: "0.5 rem 1 rem",
  overflow: "hidden",
  minHeight: 50
}));

/**
 * Styled email field component
 */
export const EmailFieldWrapper = styled(TextField, {
  label: "email-field-wrapper"
})(() => ({
  width: "100%",
  fontSize: "1em",
  border: "1px solid rgba(0, 0, 0, .5)",
  borderRadius: "0.5rem",
  padding: "0.5 rem 1 rem",
  overflow: "hidden",
  minHeight: 50,
  justifyContent: "center"
}));

/**
 * Styled checklist field component
 */
export const ChecklistFieldWrapper = styled(Box, {
  label: "checklistFieldWrapper-field-wrapper"
})(() => ({
  flex: 1,
  width: "100%"
}));

/*
 * Styled table text cell component
 */
export const TableTextCellWrapper = styled(TextField, {
  label: "table-text-cell"
})(() => ({
  flex: 1,
  width: "100%",
  fontSize: "1em",
  border: "none",
  backgroundColor: "rgba(0,0,0,0.07)",
  overflow: "auto"
}));

/**
 * Styled table number cell component
 */
export const TableNumberCellWrapper = styled(TextField, {
  label: "table-number-cell"
})(() => ({
  width: "100%",
  fontSize: "1em",
  border: "1px dashed rgba(0, 0, 0, .3)",
  backgroundColor: "rgba(0,0,0,0.07)",
  overflow: "auto"
}));

/**
 * Styled administrator form list stack component
 */
export const AdminFormListStack = styled(Stack, {
  label: "admin-form-list-stack"
})(() => ({
  alignItems: "center",
  padding: "1rem"
}));

/**
 * Styled administrator form text field component
 */
export const AdminFormTypographyField = styled(Typography, {
  label: "admin-form-text-field"
})(() => ({
  flex: 1,
  width: "100%",
  fontSize: "1em",
  margin: "0.5rem"
}));

/**
 * Styled administrator form replies stack component
 */
export const AdminFormRepliesScreenStack = styled(Stack, {
  label: "admin-form-replies-list-stack"
})(() => ({
  alignItems: "center",
  padding: "1rem"
}));

/**
 * Styled text for the administrator form replies screen
 */
export const AdminFormRepliesScreenText = styled(Typography, {
  label: "admin-form-replies-screen-text"
})(() => ({
  flex: 1,
  width: "100%",
  fontSize: "1em",
  margin: "0.5rem"
}));