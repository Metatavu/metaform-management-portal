import { ListItemText, Stack } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import { NavigationLinks } from "types";
import LocalizationUtils from "utils/localization-utils";
import NavigationLink from "./navigation-link";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import CodeIcon from "@mui/icons-material/Code";
import NavigationUtils from "utils/navigation-utils";
import { HeaderNavigationWrapper } from "styled/layouts/navigations";
import FormRestrictedContent from "components/containers/form-restricted-content";
import { useAppSelector } from "app/hooks";
import { selectKeycloak } from "features/auth-slice";

/**
 * Navigation header component
 */
const NavigationHeader: React.FC = () => {
  const { pathname } = useLocation();

  const currentNavigation = NavigationUtils.matchNavigation(pathname);
  const [ title, description ] = LocalizationUtils.getLocalizedNavigationLink(currentNavigation);
  const keycloak = useAppSelector(selectKeycloak);
  
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
      <FormRestrictedContent>
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
        { keycloak?.hasRealmRole("metatavu-admin") &&
          <NavigationLink
            currentNavigation={ currentNavigation }
            navigation={ NavigationLinks.SCRIPTS }
            renderIcon={ color => <CodeIcon htmlColor={ color }/> }
          />
        }
      </FormRestrictedContent>
    </Stack>
  );

  /**
   * Component render
   */
  return (
    <HeaderNavigationWrapper direction="row">
      <ListItemText
        primary={ title }
        primaryTypographyProps={{ variant: "h1" }}
        secondary={ description }
        secondaryTypographyProps={{ variant: "subtitle1" }}
      />
      { renderNavigationLinks() }
    </HeaderNavigationWrapper>
  );
};

export default NavigationHeader;