import { Stack, styled } from "@mui/material";

/**
 * Styled breadcrumbs container wrapper
 */
const NavigationWrapper = styled(Stack, {
  label: "breadcrumb-wrapper"
})(({ theme }) => ({
  paddingTop: theme.spacing(1),
  width: 120,
  height: "100%",
  alignItems: "center"
}));

export default NavigationWrapper;