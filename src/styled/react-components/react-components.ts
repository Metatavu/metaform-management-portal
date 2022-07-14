import { Slider, Box, Input } from "@mui/material";
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
 * Styled slider field component
 */
export const SliderFieldWrapper = styled(Slider, {
  label: "slider-field-wrapper"
})(() => ({
  flex: 1,
  width: "100%",
  height: "4px",
  color: "#4FA3DF"
}));

/**
 * Styled submit field component
 */
export const SubmitFieldWrapper = styled(Input, {
  label: "submit-field-wrapper"
})(() => ({
  flex: 1,
  borderRadius: "0.3rem",
  border: 0
}));