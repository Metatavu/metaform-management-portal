import { Typography, Stack } from "@mui/material";
import getRoutes from "./routes";
import React from "react";
import useBreadcrumbs, { BreadcrumbData } from "use-react-router-breadcrumbs";
import { Crumb, Wrapper } from "styled/layouts/breadcrumbs";
import theme from "theme";

/**
 * Breadcrumbs component
 */
const Breadcrumbs: React.FC = () => {
  const breadcrumbs = useBreadcrumbs(getRoutes(), { disableDefaults: true });

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
          <Typography variant="subtitle2">
            { breadcrumb }
          </Typography>
        </Crumb>
        { !lastLink &&
          <Typography color={ theme.palette.secondary.main } variant="subtitle2">/</Typography>
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