import { Paper, styled } from "@mui/material";
import { NavLink } from "react-router-dom";
import theme from "theme";

/**
 * Styled breadcrumbs container wrapper
 */
export const Wrapper = styled(Paper, {
  label: "breadcrumb-wrapper"
})(() => ({
  display: "flex",
  alignItems: "center",
  flex: 1,
  zIndex: theme.zIndex.drawer,
  padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 0
}));

/**
 * Styled breadcrumbs crumb
 */
export const Crumb = styled(NavLink, {
  label: "breadcrumb-link"
})(() => ({
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline"
  }
}));