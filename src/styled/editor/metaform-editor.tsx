import { Paper, Stack, TablePagination } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Styled metaform editor content component
 */
export const EditorContent = styled(Stack, {
  label: "metaform-editor-content"
})(({ theme }) => ({
  padding: `${theme.spacing(8)} ${theme.spacing(12)}`,
  overflow: "auto",
  flex: 1,
  backgroundColor: theme.palette.grey[300]
}));

/**
 * Styled metaform editor wrapper component
 */
export const EditorWrapper = styled(Stack, {
  label: "metaform-editor-wrapper"
})(() => ({
  overflow: "hidden",
  flexDirection: "row",
  flex: 1
}));

/**
 * Styled metaform editor drawer component
 */
export const EditorDrawer = styled(Paper, {
  label: "metaform-editor-drawer"
})(() => ({
  width: "12vw",
  minWidth: 360,
  height: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column"
}));

/**
 * Styled metaform editor section component
 */
export const EditorSection = styled(Paper, {
  label: "metaform-editor-section"
})(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 25
}));

/**
 * Styled text for the form pagination
 */
export const FormPagination = styled(TablePagination, {
  label: "form-pagination"
})(() => ({
  overflow: "hidden",
  flexShrink: 0
}));

/**
 * Styled text for the form list container
 */
export const FormListContainer = styled(Stack, {
  label: "form-list-container"
})(() => ({
  overflow: "hidden",
  height: "100%"
}));

/**
 * Styled text for the forms container
 */
export const FormsContainer = styled(Stack, {
  label: "forms-container"
})(() => ({
  overflow: "auto",
  flex: 1
}));