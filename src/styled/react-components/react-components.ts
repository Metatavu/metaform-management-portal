import { Slider, Box, TextField, Input, Autocomplete, Stack, Typography, Button, FormControl, Grid, DialogTitle } from "@mui/material";
import { styled } from "@mui/material/styles";
import Config from "app/config";
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
  border: `1px solid ${theme.palette.grey[300]}`,
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
  border: 0,
  color: "#fff",
  backgroundColor: "#000",
  "& .MuiSvgIcon-root": {
    color: "#fff"
  },
  "&:hover": {
    border: 0,
    color: theme.palette.primary.contrastText,
    backgroundColor: Config.get().theme.paletteSecondaryMain,
    "& .MuiSvgIcon-root": {
      color: theme.palette.primary.contrastText
    }
  }
}));

/**
 * Styled add row button component
 */
export const AddRowButtonWrapper = styled(Button, {
  label: "add-row-button-wrapper"
})(() => ({
  border: 0,
  color: "#fff",
  backgroundColor: "#000",
  "& .MuiSvgIcon-root": {
    color: "#fff"
  },
  "&:hover": {
    color: theme.palette.primary.contrastText,
    backgroundColor: Config.get().theme.paletteSecondaryMain,
    "& .MuiSvgIcon-root": {
      color: theme.palette.primary.contrastText
    }
  },
  width: "100%",
  marginTop: "0.5rem"
}));

/**
 * Styled files row component
 */
export const FilesRowWrapper = styled(Stack, {
  label: "files-row-wrapper"
})(() => ({
  display: "flex",
  padding: "0.5rem",
  alignItems: "center",
  borderBottom: `1px dashed ${theme.palette.grey[300]}`
}));

/**
 * Styled table component
 */
export const TableWrapper = styled(Stack, {
  label: "table-wrapper"
})(() => ({
  display: "flex"
}));

/**
 * Styled files button component
 */
export const FilesButtonWrapper = styled(Button, {
  label: "files-button-wrapper"
})(() => ({
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
  backgroundColor: theme.palette.background.paper,
  width: "100%",
  border: `1px solid ${theme.palette.grey[300]}`,
  maxHeight: 50,
  justifyContent: "center",
  overflow: "hidden"
}));

/**
 * Styled radio option component
 */
export const RadioOptionWrapper = styled(FormControl, {
  label: "radio-option-wrapper"
})(() => ({
  backgroundColor: theme.palette.background.paper,
  width: "100%",
  border: `1px solid ${theme.palette.grey[300]}`,
  maxHeight: 50,
  justifyContent: "center",
  overflow: "hidden",
  height: 50
}));

/**
 * Styled form group component
 */
export const CheckListOptionWrapper = styled(FormControl, {
  label: "checklist-option-wrapper"
})(() => ({
  backgroundColor: theme.palette.background.paper,
  width: "100%",
  border: `1px solid ${theme.palette.grey[300]}`,
  height: 50,
  justifyContent: "center",
  overflow: "hidden"
}));

/**
 * Styled radio field component
 */
export const RadioFieldWrapper = styled(Stack, {
  label: "radio-field-wrapper"
})(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5)
}));

/*
 * Styled url field component
 */
export const UrlFieldWrapper = styled(Input, {
  label: "url-field-wrapper"
})(() => ({
  flex: 1,
  border: `1px solid ${theme.palette.grey[300]}`,
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
  border: `1px solid ${theme.palette.grey[300]}`,
  backgroundColor: theme.palette.background.paper,
  padding: "0.5rem 1rem"
}));

/**
 * Styled memo field component
 */
export const MemoFieldWrapper = styled(TextField, {
  label: "memo-field-wrapper"
})(() => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[300]}`,
  width: "100%",
  minHeight: 100
}));

/**
 * Styled date field component
 */
export const DateFieldWrapper = styled(Box, {
  label: "date-field-wrapper"
})(() => ({
  backgroundColor: theme.palette.background.paper,
  flex: 1,
  width: "100%",
  minHeight: 50,
  display: "flex",
  flexDirection: "column",
  alignItems: "space-between",
  justifyContent: "center"
}));

/**
 * Styled number field component
 */
export const NumberFieldWrapper = styled(TextField, {
  label: "number-field-wrapper"
})(() => ({
  backgroundColor: theme.palette.background.paper,
  width: "100%",
  fontSize: "1em",
  border: `1px solid ${theme.palette.grey[300]}`,
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
  border: `1px solid ${theme.palette.grey[300]}`,
  padding: "0.5 rem 1 rem",
  overflow: "hidden",
  minHeight: 50,
  justifyContent: "center"
}));

/**
 * Styled checklist field component
 */
export const ChecklistFieldWrapper = styled(Stack, {
  label: "checklistFieldWrapper-field-wrapper"
})(() => ({
  flex: 1,
  width: "100%",
  gap: theme.spacing(0.5)
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
  backgroundColor: theme.palette.background.paper,
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
  backgroundColor: theme.palette.background.paper,
  overflow: "auto"
}));

/**
 * Styled administrator form list stack component
 */
export const AdminFormListStack = styled(Stack, {
  label: "admin-form-list-stack"
})(() => ({
  alignItems: "center",
  flex: 1,
  justifyContent: "flex-end"
}));

/**
 * Styled administrator form text field component
 */
export const AdminFormTypographyField = styled(Typography, {
  label: "admin-form-text-field"
})(() => ({
  display: "flex",
  flex: 1,
  width: "100%",
  fontSize: "1em",
  margin: "0.5rem",
  alignItems: "center"
}));

/**
 * Styled text for the version list header
 */
export const VersionListHeader = styled(Grid, {
  label: "version-list-header"
})(() => ({
  borderTop: `1px solid ${theme.palette.grey[300]}`,
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  padding: 0,
  height: "60px",
  alignContent: "center"
}));

/**
 * Style dialog title component
 */
export const DialogTitleWrapper = styled(DialogTitle, {
  label: "dialog-title"
})(() => ({
  fontSize: 20,
  fontWeight: 600,
  backgroundColor: "#000",
  color: "#fff",
  textAlign: "center"
}));

/**
 * Styled overlay for disabled feature
 */
export const DisabledFeatureWrapper = styled(Box, {
  label: "disabled-feature-wrapper"
})(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.1) 10px, rgba(0, 0, 0, 0.1) 20px)",
  zIndex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}));