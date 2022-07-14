import { Autocomplete } from "@mui/material";
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

export default HtmlAutocompleteWrapper;