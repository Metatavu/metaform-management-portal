import { Stack, styled } from "@mui/material";

/**
 * Styled navigation wrapper
 */
const NavigationWrapper = styled(Stack, {
  label: "navigation-wrapper"
})(({ theme }) => ({
  paddingTop: theme.spacing(1),
  width: 120,
  height: "100%",
  alignItems: "center"
}));

export default NavigationWrapper;