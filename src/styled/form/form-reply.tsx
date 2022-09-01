import { Box, Button, Stack } from "@mui/material";
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
  backgroundColor: "#fff",
  alignItems: "center",
  padding: theme.spacing(4),
  justifyContent: "space-between"
}));

/**
 * Styled new member group button component
 */
export const FormReplyActionButton = styled(Button, {
  label: "form-reply-action-button"
})(({ theme }) => ({
  borderRadius: "1em",
  fontWeight: "bold",
  height: "fit-content",
  padding: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
  alignSelf: "center"
}));