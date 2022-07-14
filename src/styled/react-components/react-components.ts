import { Box, Input } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Styled html field component
 */
export const HtmlFieldWrapper = styled(Box, {
  label: "html-field-wrapper"
})(() => ({
  flex: 1,
  width: "100%",
  height: "auto"
}));

/**
 * Styled url field component
 */
export const UrlFieldWrapper = styled(Input, {
  label: "url-field-wrapper"
})(() => ({
  flex: 1,
  width: "80%",
  height: "auto",
  backgroundColor: "#fff"
}));

/**
 * Styled text field component
 */
export const TextFieldWrapper = styled(Input, {
  label: "text-field-wrapper"
})(() => ({
  flex: 1,
  width: "100%",
  height: "auto",
  fontSize: "15px",
  border: "1px solid rgba(0, 0, 0, .5)",
  borderRadius: "0.5rem",
  backgroundColor: "#fff"
}));