import { Box } from "@mui/material";
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
 * Styled select field component
 */
export const SelectFieldWrapper = styled(Box, {
  label: "select-field-wrapper"
})(() => ({
  width: "100%",
  backgroundColor: "#fff",
  borderRadius: "1em"
}));

/**
 * Styled radio field component
 */
export const RadioFieldWrapper = styled(Box, {
  label: "radio-field-wrapper"
})(() => ({
  width: "100%"
}));