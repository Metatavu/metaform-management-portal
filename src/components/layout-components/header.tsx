import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect } from "react";
import { HeaderToolbar, Logo, LogoContainer, Root } from "styled/layout-components/header";
import theme from "theme";
import EssoteLogoPath from "resources/svg/essote-logo.svg";
import { logout, selectKeycloak } from "features/auth-slice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import strings from "localization/strings";

/**
 * Header component
 *
 * @param props component properties
 */
const Header: React.FC = ({
  children
}) => {
  const keycloak = useAppSelector(selectKeycloak);

  const dispatch = useAppDispatch();

  const [ userEmail, setUserEmail ] = React.useState<string>("");
  
  useEffect(() => {
    if (keycloak?.tokenParsed?.email) {
      setUserEmail(keycloak.tokenParsed.email);
    }
  }, []);

  /**
   * Renders logout button
   */
  const renderLogoutButton = () => {
    return (
      <Button color="error" onClick={ () => dispatch(logout()) }>{ strings.generic.logout }</Button>
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
          <InputLabel style={{ color: "white" }} id="user-email">{ strings.header.user }</InputLabel>
          <Select
            label={ strings.header.user }
            value={ userEmail }
            id="user-email"
            sx={{
              color: "white",
              minWidth: 300,
              backgroundColor: "transparent",
              borderRadius: theme.shape.borderRadius
            }}
            renderValue={ () => userEmail }
          >
            <MenuItem>{ renderLogoutButton() }</MenuItem>
          </Select>
        </FormControl>
      </HeaderToolbar>
      { children }
    </Root>
  );
};

export default Header;