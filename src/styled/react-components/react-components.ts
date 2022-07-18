import { Autocomplete } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

/**
 * Styled autocomplete field component
 */
export const HtmlAutocompleteWrapper = styled(Autocomplete, {
  label: "HtmlAutocompleteWrapper"
})(() => ({
  flex: 1,
  width: "100%",
  height: "auto;"
}));

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

export default {
  HtmlAutocompleteWrapper: HtmlAutocompleteWrapper,
  HtmlFieldWrapper: HtmlFieldWrapper
};