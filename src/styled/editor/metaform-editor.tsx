import { Paper, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Styled metaform editor content component
 */
export const EditorContent = styled(Stack, {
  label: "metaform-editor-content"
})(({ theme }) => ({
  padding: theme.spacing(8),
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
  width: 300,
  height: "100%"
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