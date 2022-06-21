import { Paper, styled, Typography, Stack } from "@mui/material";
import routes from "./routes";
import React from "react";
import { NavLink } from "react-router-dom";
import theme from "theme";
import useBreadcrumbs, { BreadcrumbData } from "use-react-router-breadcrumbs";

/**
 * Styled breadcrumbs container wrapper
 */
const Wrapper = styled(Paper, {
  label: "breadcrumb-wrapper"
})(() => ({
  display: "flex",
  alignItems: "center",
  flex: 1,
  zIndex: theme.zIndex.drawer,
  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  backgroundColor: theme.palette.background.default
}));

/**
 * Styled breadcrumbs crumb
 */
const Crumb = styled(NavLink, {
  label: "breadcrumb-link"
})(() => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline"
  }
}));

/**
 * Breadcrumbs component
 */
const Breadcrumbs: React.FC = () => {
  const breadcrumbs = useBreadcrumbs(routes, { disableDefaults: true });

  /**
   * Renders single breadcrumb
   *
   * @param breadcrumbData breadcrumb data
   * @param index index of the breadcrumb
   */
  const renderSingleBreadcrumb = (breadcrumbData: BreadcrumbData, index: number) => {
    const { match, breadcrumb } = breadcrumbData;
    const { pathname } = match;
    const lastLink = (index + 1 === breadcrumbs.length) && breadcrumbs.length > 1;
    const currentPage = (index + 2 === breadcrumbs.length) && breadcrumbs.length > 1;

    return (
      <Stack
        key={ pathname }
        direction="row"
        alignItems="center"
        spacing={ 1 }
        mr={ 1 }
      >
        <Crumb
          to={ pathname }
          hidden={ lastLink }
        >
          <Typography
            variant="subtitle2"
            style={ currentPage ? { fontWeight: "bold", color: theme.palette.primary.main } : {} }
          >
            { breadcrumb }
          </Typography>
        </Crumb>
        { !lastLink &&
          <Typography sx={{ fontWeight: 100 }}>/</Typography>
        }
      </Stack>
    );
  };

  /**
   * Component render
   */
  return (
    <Wrapper elevation={ 6 }>
      { breadcrumbs.map(renderSingleBreadcrumb) }
    </Wrapper>
  );
};

export default Breadcrumbs;