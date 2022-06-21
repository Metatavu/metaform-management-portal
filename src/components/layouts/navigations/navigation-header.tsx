import { Stack, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import { NavigationLinks } from "types";
import LocalizationUtils from "utils/localization-utils";
import NavigationLink from "./navigation-link";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import NavigationUtils from "utils/navigation-utils";
import { HeaderNavigationWrapper } from "styled/layouts/navigations";
/**
 * Navigation header component
 */
const NavigationHeader: React.FC = () => {
  const { pathname } = useLocation();

  const currentNavigation = NavigationUtils.matchNavigation(pathname);
  const [ title, description ] = LocalizationUtils.getLocalizedNavigationLink(currentNavigation);

  /**
   * Renders header text
   */
  const renderHeaderText = () => (
    <Stack>
      <Typography variant="h1">{ title }</Typography>
      <Typography variant="h4">{ description }</Typography>
    </Stack>
  );

  /**
   * Renders navigation links
   */
  const renderNavigationLinks = () => (
    <Stack direction="row">
      <NavigationLink
        currentNavigation={ currentNavigation }
        navigation={ NavigationLinks.FORMS }
        renderIcon={ color => <FormatAlignJustifyIcon htmlColor={ color }/> }
      />
      <NavigationLink
        currentNavigation={ currentNavigation }
        navigation={ NavigationLinks.USERS }
        renderIcon={ color => <GroupIcon htmlColor={ color }/> }
      />
      <NavigationLink
        currentNavigation={ currentNavigation }
        navigation={ NavigationLinks.EDITOR }
        renderIcon={ color => <EditIcon htmlColor={ color }/> }
      />
    </Stack>
  );

  /**
   * Component render
   */
  return (
    <HeaderNavigationWrapper direction="row">
      { renderHeaderText() }
      { renderNavigationLinks() }
    </HeaderNavigationWrapper>
  );
};

export default NavigationHeader;