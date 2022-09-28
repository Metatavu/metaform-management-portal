import { Typography, Stack } from "@mui/material";
import getRoutes from "./routes";
import React from "react";
import useBreadcrumbs, { BreadcrumbData } from "use-react-router-breadcrumbs";
import { Crumb, Wrapper } from "styled/layouts/breadcrumbs";
import { useAppSelector } from "app/hooks";
import { selectLocale } from "features/locale-slice";

/**
 * Breadcrumbs component
 */
const Breadcrumbs: React.FC = () => {
  const { locale } = useAppSelector(selectLocale);
  const breadcrumbs = useBreadcrumbs(getRoutes(locale), { disableDefaults: true });

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