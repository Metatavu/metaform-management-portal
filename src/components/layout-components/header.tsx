import { TextField } from "@mui/material";
import React from "react";
import { HeaderToolbar, Logo, LogoContainer, Root } from "styled/layout-components/header";
import theme from "theme";
import EssoteLogoPath from "resources/svg/essote-logo.svg";
import { selectKeycloak } from "features/auth-slice";
import { useAppSelector } from "app/hooks";

/**
 * Component properties
 */
interface Props {
}

/**
 * Header component
 *
 * @param props component properties
 */
const Header: React.FC<Props> = ({
  children
}) => {
  const keycloak = useAppSelector(selectKeycloak);

  return (
    <Root position="static">
      <HeaderToolbar>
        <LogoContainer>
          {/* TODO replace the logo to higher resolution */}
          <Logo alt="Essote logo" src={ EssoteLogoPath }/>
        </LogoContainer>
        <TextField
          sx={{
            width: 300,
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius
          }}
          label={ keycloak?.tokenParsed.email }
          select
        />
      </HeaderToolbar>
      { children }
    </Root>
  );
};

export default Header;