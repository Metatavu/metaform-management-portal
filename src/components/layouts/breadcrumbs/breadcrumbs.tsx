import { Typography, Stack } from "@mui/material";
import routes from "./routes";
import React from "react";
import useBreadcrumbs, { BreadcrumbData } from "use-react-router-breadcrumbs";
import { Crumb, Wrapper } from "styled/layouts/breadcrumbs";

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
        >
          <Typography
            variant="subtitle2"
            style={ currentPage ? { fontWeight: "bold" } : {} }
          >
            { breadcrumb }
          </Typography>
        </Crumb>
        { !lastLink &&
          <Typography variant="subtitle2">/</Typography>
        }
      </Stack>
    );
  };

  /**
   * Component render
   */
  return (
    <Wrapper elevation={ 0 }>
      { breadcrumbs.map(renderSingleBreadcrumb) }
    </Wrapper>
  );
};

export default Breadcrumbs;