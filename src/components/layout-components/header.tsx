import { TextField } from "@mui/material";
import strings from "localization/strings";
import React from "react";
import { HeaderToolbar, Logo, LogoContainer, Root } from "styled/layout-components/header";
import theme from "theme";
// import EssoteLogoPath from "resources/svg/essote-logo.svg";

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
  return (
    <Root position="static">
      <HeaderToolbar>
        <LogoContainer>
          {/* TODO replace the logo to higher resolution */}
          <Logo alt="Essote logo"/>
        </LogoContainer>
        <TextField
          sx={{
            width: 300,
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius
          }}
          label={ strings.header.user }
          select
        />
      </HeaderToolbar>
      { children }
    </Root>
  );
};

export default Header;