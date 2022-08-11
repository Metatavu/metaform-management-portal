import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect } from "react";
import { HeaderToolbar, Logo, Root } from "styled/layout-components/header";
import { logout, selectKeycloak } from "features/auth-slice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import strings from "localization/strings";
import LogoutIcon from "@mui/icons-material/Logout";

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
      <Button
        variant="text"
        onClick={ () => dispatch(logout()) }
        endIcon={ <LogoutIcon/> }
        style={{
          textTransform: "none",
          flex: 1,
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        { strings.generic.logout }
      </Button>
    );
  };

  return (
    <Root position="static">
      <HeaderToolbar>
        <Logo/>
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel
            style={{
              color: "white"
            }}
            id="user-email"
          >
            { strings.header.user }
          </InputLabel>
          <Select
            label={ strings.header.user }
            value={ userEmail }
            id="user-email"
            sx={{
              ".MuiSvgIcon-root": {
                fill: "white !important"
              },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(228, 219, 233, 0.5)"
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(228, 219, 233, 0.5)"
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(228, 219, 233, 0.5)"
              },
              color: "#fff",
              borderRadius: "1rem"
            }}
            renderValue={ () => userEmail }
          >
            <MenuItem style={{ backgroundColor: "#fff" }}>{ renderLogoutButton() }</MenuItem>
          </Select>
        </FormControl>
      </HeaderToolbar>
      { children }
    </Root>
  );
};

export default Header;