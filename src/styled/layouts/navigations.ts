import { Stack, styled } from "@mui/material";

/**
 * Styled header navigation wrapper
 */
export const HeaderNavigationWrapper = styled(Stack, {
  label: "head-navigation-wrapper"
})(({ theme }) => ({
  padding: `0 ${theme.spacing(4)}`,
  flex: theme.spacing(1),
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper
}));

/**
 * Styled navigation wrapper
 */
export const NavigationWrapper = styled(Stack, {
  label: "navigation-wrapper"
})(({ theme }) => ({
  paddingTop: theme.spacing(1),
  width: 120,
  height: "100%",
  alignItems: "center"
}));

/**
 * Styled navigation tab container
 */
export const NavigationTabContainer = styled(Stack, {
  label: "navigation-tab-container"
})(() => ({
  height: 100,
  flexDirection: "row",
  overflow: "hidden",
  flexShrink: 0
}));

/**
 * Styled navigation tab wrapper
 */
export const NavigationTabWrapper = styled(Stack, {
  label: "navigation-tab-wrapper"
})(({ theme }) => ({
  height: "100%",
  flexDirection: "row",
  alignItems: "center",
  padding: theme.spacing(4)
}));