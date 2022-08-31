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
  backgroundColor: "#fff",
  alignItems: "center",
  padding: theme.spacing(4),
  justifyContent: "space-between"
}));

/**
 * Styled metaform container
 */
export const ReplyFormContainer = styled(Box, {
  label: "reply-metaform-container"
})(({ theme }) => ({
  display: "flex",
  overflow: "auto",
  justifyContent: "center",

  "& .metaform": {
    maxWidth: 800,
    flex: 1,
    marginInline: theme.spacing(4),
    flexDirection: "column",
    display: "flex",
    "@media(max-width: 800px)": {
      marginInline: theme.spacing(2)
    },

    "& section": {
      border: "none",
      borderRadius: "0.5rem",
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      backgroundColor: "#fff",
      boxShadow: "5px 5px 5px rgba(0,0,0,0.5)"
    },

    "& fieldset": {
      padding: 0,
      border: "none"
    },

    "& .metaform-field": {
      marginBottom: theme.spacing(1)
    },

    "& .metaform-field-label": {
      color: "rgba(0,0,0,.5)"
    },

    "& h1": {
      textAlign: "center"
    },

    "& h2": {
      fontWeight: 600,
      fontSize: 20,
      paddingBottom: theme.spacing(1)
    },

    "& h3": {
      fontWeight: 100,
      fontSize: 20
    }
  }
}));