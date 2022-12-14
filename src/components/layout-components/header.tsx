import { Button, FormControl, IconButton, InputLabel, MenuItem, Stack, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import { HeaderSelect, HeaderToolbar, Logo, Root } from "styled/layout-components/header";
import { logout, selectKeycloak } from "features/auth-slice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import strings from "localization/strings";
import LogoutIcon from "@mui/icons-material/Logout";
import { selectLocale, setLocale } from "features/locale-slice";
import { HelpOutline } from "@mui/icons-material";
import Config from "app/config";
import theme from "theme";

/**
 * Header component
 *
 * @param props component properties
 */
const Header: React.FC = ({
  children
}) => {
  const keycloak = useAppSelector(selectKeycloak);
  const { locale } = useAppSelector(selectLocale);

  const dispatch = useAppDispatch();

  const [ userEmail, setUserEmail ] = React.useState<string>("");
  
  useEffect(() => {
    if (keycloak?.tokenParsed?.email) {
      setUserEmail(keycloak.tokenParsed.email);
    }
  }, []);
  
  /**
   * Renders info button with link to instructions of essote management portal
   */
  const renderInfoButton = () => {
    const tutorialUrl = Config.getTutorialUrl() || "";
    return (
      <Tooltip title={ strings.header.infoLabel } placement="left" arrow>
        <IconButton href={ tutorialUrl }>
          <HelpOutline
            fontSize="large"
            sx={{ color: theme.palette.grey[200] }}
          />
        </IconButton>
      </Tooltip>
    );
  };
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

  /**
   * Renders language selection options
   */
  const renderLanguageSelectOptions = () => (
    strings.getAvailableLanguages().map(language =>
      <MenuItem
        key={ language }
        value={ language }
      >
        { strings.getString(`header.languages.${language}`, locale) }
      </MenuItem>)
  );

  /**
   * Renders language selection
   */
  const renderLanguageSelection = () => (
    <HeaderSelect
      label={ strings.header.selectLanguage }
      value={ locale }
      id="localization"
      sx={{
        width: "125px"
      }}
      onChange={ event => dispatch(setLocale(event.target.value as string)) }
    >
      { renderLanguageSelectOptions() }
    </HeaderSelect>
  );

  /**
   * Renders logout selection
   */
  const renderLogoutSelection = () => (
    <HeaderSelect
      label={ strings.header.user }
      value={ userEmail }
      id="user-email"
      renderValue={ () => userEmail}
    >
      <MenuItem style={{ backgroundColor: "#fff" }}>{ renderLogoutButton() }</MenuItem>
    </HeaderSelect>
  );

  return (
    <Root position="static">
      <HeaderToolbar>
        <Logo/>
        <Stack direction="row" spacing={ 3 }>
          { renderInfoButton() }
          <FormControl>
            <InputLabel
              style={{
                color: "white"
              }}
              htmlFor="localization"
            >
              { strings.header.selectLanguage }
            </InputLabel>
            { renderLanguageSelection() }
          </FormControl>
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel
              style={{
                color: "white"
              }}
              htmlFor="user-email"
            >
              { strings.header.user }
            </InputLabel>
            { renderLogoutSelection() }
          </FormControl>
        </Stack>
      </HeaderToolbar>
      { children }
    </Root>
  );
};

export default Header;