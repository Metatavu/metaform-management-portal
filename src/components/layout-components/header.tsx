import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect } from "react";
import { HeaderToolbar, Logo, LogoContainer, Root } from "styled/layout-components/header";
import theme from "theme";
import EssoteLogoPath from "resources/svg/essote-logo.svg";
import { selectKeycloak } from "features/auth-slice";
import { useAppSelector } from "app/hooks";
import { useNavigate } from "react-router-dom";

/**
 * Header component
 *
 * @param props component properties
 */
const Header: React.FC = ({
  children
}) => {
  const keycloak = useAppSelector(selectKeycloak);

  const [ userEmail, setUserEmail ] = React.useState<string>("Testikäyttäjä");
  const usenavigte = useNavigate();
  useEffect(() => {
    if (keycloak?.tokenParsed?.email) {
      setUserEmail(keycloak.tokenParsed.email);
    }
    console.log("userEamail", userEmail);
  }, []);

  /**
   * Logout keycloak user
   */
  const logout = () => {
    keycloak?.logout().then(() => { usenavigte("/"); });
  };

  /**
   * Renders logout button
   */
  const renderLogoutButton = () => {
    return (
      <Button onClick={ logout }>Kirjadu ulos</Button>
    );
  };

  return (
    <Root position="static">
      <HeaderToolbar>
        <LogoContainer>
          {/* TODO replace the logo to higher resolution */}
          <Logo alt="Essote logo" src={ EssoteLogoPath }/>
        </LogoContainer>
        <FormControl>
          <InputLabel color="info" id="user-email">Käyttäjä</InputLabel>
          <Select
            id="user-email"
            value={ userEmail }
            sx={{
              width: 300,
              backgroundColor: "transparent",
              borderRadius: theme.shape.borderRadius
            }}
          >
            <MenuItem>{ userEmail }</MenuItem>
            <MenuItem>{ renderLogoutButton() }</MenuItem>
          </Select>
        </FormControl>
      </HeaderToolbar>
      { children }
    </Root>
  );
};

export default Header;