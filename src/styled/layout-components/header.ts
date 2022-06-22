import { AppBar, Box, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Styled header
 */
export const Root = styled(AppBar, {
  label: "header-root"
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "transparent",
  padding: `${theme.spacing(2)} 0`
}));

/**
 * Styled logo toolbar content component
 */
export const HeaderToolbar = styled(Toolbar, {
  label: "header-toolbar"
})(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
}));

/**
 * Styled logo container component
 */
export const LogoContainer = styled(Box, {
  label: "logo-container"
})(() => ({
  display: "flex",
  width: 150
}));

/**
 * Styled logo container component
 */
export const Logo = styled("img", {
  label: "logo"
})(() => ({
  width: "100%"
}));

export default Root;