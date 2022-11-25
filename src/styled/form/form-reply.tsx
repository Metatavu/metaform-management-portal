import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Styled metaform reply view container component
 */
export const ReplyViewContainer = styled(Stack, {
  label: "form-reply-container"
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: theme.palette.grey[300],
  overflow: "hidden"
}));

/**
 * Styled metaform form reply content component
 */
export const FormReplyContent = styled(Box, {
  label: "form-reply-content"
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  overflow: "auto",
  padding: theme.spacing(4)
}));

/**
 * Styled metaform form reply action component
 */
export const FormReplyAction = styled(Box, {
  label: "form-reply-action"
})(({ theme }) => ({
  height: 100,
  display: "flex",
  backgroundColor: theme.palette.background.paper,
  alignItems: "center",
  padding: theme.spacing(4),
  justifyContent: "space-between"
}));