import { Stack, Typography } from "@mui/material";
import theme from "theme";
import React from "react";
import { Link } from "react-router-dom";
import { NavigationTabWrapper } from "styled/layouts/navigations";

/**
 * Component properties
 */
interface Props {
  active?: boolean;
  title: string;
  description: string;
  to?: string;
  renderFilters?: () => React.ReactNode;
}

/**
 * Draft editor screen component
 */
const NavigationTab: React.FC<Props> = ({
  active = true,
  title,
  description,
  to,
  renderFilters
}) => {
  const linkEnabled = active && !to;
  const color = linkEnabled ?
    undefined :
    theme.palette.grey[400];

  /**
   * Renders tab content
   */
  const renderTabContent = () => (
    <NavigationTabWrapper
      sx={{
        backgroundColor: linkEnabled ?
          "#fff" :
          theme.palette.grey[100]
      }}
    >
      <Stack>
        <Typography variant="h1" color={ color }>{ title }</Typography>
        <Typography variant="h4" color={ color }>{ description }</Typography>
      </Stack>
      { linkEnabled && renderFilters?.() }
    </NavigationTabWrapper>
  );

  if (!to) {
    return renderTabContent();
  }

  /**
   * Component render
   */
  return (
    <Link
      to={ to }
      style={{ textDecoration: "none", width: "100%" }}
    >
      { renderTabContent() }
    </Link>
  );
};

export default NavigationTab;