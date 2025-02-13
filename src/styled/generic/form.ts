import { Box, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Styled metaform container
 */
export const FormContainer = styled(Box, {
  label: "metaform-container"
})(() => ({
  overflow: "auto"
}));

/**
 * Styled metaform layout
 */
export const FormLayout = styled(Box, {
  label: "metaform-container"
})(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  justifyContent: "center"
}));

/**
 * Styled metaform body component
 */
export const MetaformBody = styled(Stack, {
  label: "metaform-body"
})(({ theme }) => ({
  maxWidth: 800,
  flex: 1,
  marginInline: theme.spacing(4),
  "@media(max-width: 800px)": {
    marginInline: theme.spacing(2)
  }
}));

/**
 * Styled metaform title component
 */
export const MetaformTitle = styled(Typography, {
  label: "metaform-title"
})(({ theme }) => ({
  textAlign: "center",
  wordBreak: "break-word",
  fontSize: 36,
  fontWeight: "bold",
  color: theme.palette.text.primary,
  fontFamily: "Arial, sans-serif",
  marginBottom: theme.spacing(2),
  "@media(max-width: 510px)": {
    fontSize: 28
  }
}));

/**
 * Styled metaform section wrapper component
 */
export const MetaformSectionWrapper = styled(Box, {
  label: "metaform-section-wrapper"
})(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.secondary.light || "#fff",
  filter: "drop-shadow(0px 0px 10px rgba(0,0,0,0.05))"
}));

/**
 * Styled metaform field wrapper component
 */
export const MetaformFieldWrapper = styled(Box, {
  label: "metaform-field-wrapper"
})(({ theme }) => ({
  marginBottom: theme.spacing(1)
}));

/**
 * Styled metaform section component
 */
export const MetaformFieldset = styled(Stack, {
  label: "metaform-fieldset"
})(() => ({
  padding: 0,
  border: "none"
}));

/**
 * Styled round action button component
 */
export const RoundActionButton = styled(Button, {
  label: "round-action-button"
})(({ theme }) => ({
  borderRadius: "1em",
  fontWeight: "bold",
  height: "fit-content",
  padding: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
  alignSelf: "center"
}));