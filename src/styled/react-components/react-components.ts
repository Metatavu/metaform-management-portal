import Box from "@mui/material/Box";
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

export default HtmlFieldWrapper;