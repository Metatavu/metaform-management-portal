import { Box, ListItemText } from "@mui/material";
import theme from "theme";
import React from "react";
import { Link } from "react-router-dom";
import { NavigationTabWrapper } from "styled/layouts/navigations";
import { ListItemData } from "types";

/**
 * Component properties
 */
interface Props {
  active?: boolean;
  text: ListItemData;
  to?: string;
  renderActions?: () => React.ReactNode;
}

/**
 * Draft editor screen component
 */
const NavigationTab: React.FC<Props> = ({
  active = true,
  text,
  to,
  renderActions
}) => {
  const { title, description } = text;
  const linkEnabled = active && !to;

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
      <ListItemText
        primary={ title }
        secondary={ description }
        secondaryTypographyProps={{ variant: "subtitle1" }}
        primaryTypographyProps={{
          variant: "h1",
          ...theme.components?.MuiListItemText?.defaultProps?.primaryTypographyProps,
          color: linkEnabled ? undefined : theme.palette.grey[400]
        }}
      />
      { linkEnabled && renderActions?.() }
    </NavigationTabWrapper>
  );

  if (!to) {
    return (
      <Box sx={{ flex: 1 }}>
        { renderTabContent() }
      </Box>
    );
  }

  /**
   * Component render
   */
  return (
    <Link
      to={ to }
      style={{ textDecoration: "none", flex: 1 }}
    >
      { renderTabContent() }
    </Link>
  );
};

export default NavigationTab;