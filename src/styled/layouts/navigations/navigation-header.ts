import { Stack, styled } from "@mui/material";

/**
 * Styled header navigation wrapper
 */
const HeaderNavigationWrapper = styled(Stack, {
  label: "head-navigation-wrapper"
})(({ theme }) => ({
  padding: `0 ${theme.spacing(4)}`,
  flex: theme.spacing(1),
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#fff"
}));

export default HeaderNavigationWrapper;