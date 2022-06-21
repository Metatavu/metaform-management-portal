import { Button, Divider, Typography } from "@mui/material";
import theme from "theme";
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavigationLinks } from "types";
import LocalizationUtils from "utils/localization-utils";
import NavigationUtils from "utils/navigation-utils";
import { NavigationWrapper } from "styled/layouts/navigations";

/**
 * Component properties
 */
interface Props {
  navigation: NavigationLinks
  currentNavigation?: NavigationLinks;
  renderIcon: (color: string) => React.ReactNode;
}

/**
 * Draft editor screen component
 */
const NavigationLink: React.FC<Props> = ({
  navigation,
  currentNavigation,
  renderIcon
}) => {
  const navigate = useNavigate();
  const [ title ] = LocalizationUtils.getLocalizedNavigationLink(navigation);
  const match = currentNavigation === navigation;
  const color = match ?
    theme.palette.primary.light :
    theme.palette.grey[400];

  /**
   * Component render
   */
  return (
    <Button
      sx={{ padding: 0 }}
      onClick={ () => navigate(NavigationUtils.getTranslatedNavigation(navigation)) }
    >
      <NavigationWrapper spacing={ 1 }>
        { renderIcon(color) }
        <Typography color={ color }>{ title }</Typography>
        { match && <Divider sx={{ height: 2 }} color={ color }/> }
      </NavigationWrapper>
    </Button>
  );
};

export default NavigationLink;