/* eslint-disable react/jsx-no-useless-fragment */
import React from "react";
import Keycloak from "keycloak-js";
import { anonymousLogin, selectAnonymousKeycloak, selectAccessToken, selectKeycloak, setKeycloak, setAccessToken, selectAnonymousAccessToken } from "features/auth-slice";
import { useAppDispatch, useAppSelector, useInterval } from "app/hooks";
import Config from "app/config";
import jwt_decode from "jwt-decode";
import { AccessToken } from "types";
import * as querystring from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorContext } from "components/contexts/error-handler";
import strings from "localization/strings";
import ConfirmDialog from "components/generic/confirm-dialog";

const MIN_VALIDITY_IN_SECONDS = 70;
const REFRESH_INTERVAL = 30;

/**
 * Interface representing a decoded access token
 */
interface DecodedAccessToken {
  sub: string | undefined;
  given_name: string | undefined;
  family_name: string | undefined;
  realm_access?: {
    roles: string[];
  }
}

/**
 * Component for handling authentication with Keycloak
 */
const AuthenticationProvider: React.FC = ({ children }) => {
  const errorContext = React.useContext(ErrorContext);

  const authConfig = Config.get().auth;
  const anonymousKeycloak = useAppSelector(selectAnonymousKeycloak);

  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const adminLogin = location.pathname.startsWith("/admin");
  const userLogin = location.pathname.startsWith("/protected");
  const accessToken = useAppSelector(selectAccessToken);
  const anonymousAccessToken = useAppSelector(selectAnonymousAccessToken);
  const keycloak = useAppSelector(selectKeycloak);
 
  /**
   * Builds access token object from login data
   *
   * @param tokenData token data
   */
  const buildToken = (tokenData: any): AccessToken => {
    const decodedToken: DecodedAccessToken = jwt_decode(tokenData.access_token);
    const created = new Date();

    return {
      created: created,
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
      refresh_expires_in: tokenData.refresh_expires_in,
      userId: decodedToken.sub,
      realmRoles: decodedToken.realm_access?.roles || []
    };
  };

  /**
   * Initializes Anonymous Keycloak authentication. Used for non-admin routes.
   */
  const initializeAnonymousAuthentication = async () => {
    try {
      const { username, password } = Config.get().anonymousUser;
      const keycloakInstance = new Keycloak(authConfig);

      const response = await fetch(`${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/token`, {
        method: "POST",
        body: querystring.stringify({
          grant_type: "password",
          username: username,
          password: password,
          client_id: authConfig.clientId
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      const createdToken = buildToken(await response.json());

      await keycloakInstance.init({
        token: createdToken.access_token,
        refreshToken: createdToken.refresh_token,
        checkLoginIframe: false
      });

      await keycloakInstance.loadUserProfile();
      dispatch(anonymousLogin(keycloakInstance));
    } catch (error) {
      errorContext.setError(strings.errorHandling.authentication, error);
    }
  };

  /**
   * Starts the login process.
   */
  const loginKeycloak = async (keycloakInstance: Keycloak) => {
    try {
      if (keycloakInstance.token) {
        dispatch(setAccessToken(keycloakInstance.token));
      } else {
        if (adminLogin) {
          await keycloakInstance.login();
        } else {
          await keycloakInstance.login({ idpHint: Config.get().form.idpHint });
        }

        await keycloakInstance.loadUserProfile();
        const { token } = keycloakInstance;

        if (token) {
          dispatch(setAccessToken(token));
        }
      }
    } catch (error) {
      errorContext.setError(strings.errorHandling.authentication, error);
    }
  };

  /**
   * Refreshes signed authentication
   *
   * @param keycloakInstance keycloakInstance
   */
  const refreshAuthentication = async (keycloakInstance?: Keycloak) => {
    try {
      if (!keycloakInstance) {
        return;
      }

      if (!keycloakInstance?.authenticated) {
        throw new Error("Not authenticated");
      }

      const refreshed = await keycloakInstance.updateToken(MIN_VALIDITY_IN_SECONDS);

      if (!refreshed) {
        return;
      }

      const { token, tokenParsed } = keycloakInstance;

      if (!tokenParsed || !tokenParsed.sub || !token) {
        return;
      }

      return keycloakInstance;
    } catch (error) {
      errorContext.setError(strings.errorHandling.authentication, error);
    }
  };

  /**
   * Refreshes anonymous authentication
   *
   * @param keycloakInstance keycloakInstance
   */
  const refreshAnonymousAuthentication = async (keycloakInstance?: Keycloak) => {
    try {
      if (!keycloakInstance) {
        return;
      }

      if (!anonymousKeycloak?.authenticated) {
        throw new Error("Not authenticated");
      }

      const refreshed = await anonymousKeycloak.updateToken(MIN_VALIDITY_IN_SECONDS);

      if (!refreshed) {
        return;
      }

      const { token, tokenParsed } = keycloakInstance;

      if (!tokenParsed || !tokenParsed.sub || !token) {
        return;
      }

      return keycloakInstance;
    } catch (error) {
      errorContext.setError(strings.errorHandling.authentication, error);
    }
  };

  /**
   * Initializes authentication
   */
  React.useEffect(() => {
    if (!userLogin && !adminLogin) {
      initializeAnonymousAuthentication();
    }
  }, [userLogin, adminLogin]);

  React.useEffect(() => {
    if (keycloak && !accessToken && adminLogin) {
      loginKeycloak(keycloak);
    }
  }, [keycloak, adminLogin, accessToken]);

  React.useEffect(() => {
    if (adminLogin || userLogin) {
      const keycloakInstance = new Keycloak(authConfig);

      keycloakInstance.init({ onLoad: "check-sso", checkLoginIframe: false }).then(() => {
        dispatch(setKeycloak(keycloakInstance));
        
        const { token } = keycloakInstance;
        if (token) {
          dispatch(setAccessToken(token));
        }
      });
    }
  }, [adminLogin, userLogin]);

  /**
   * Dispatches Keycloak to Redux
   *
   * @param updatedKeycloak Keycloak
   */
  const updateKeycloak = (updatedKeycloak?: Keycloak) => {
    if (updatedKeycloak) {
      const { token } = updatedKeycloak;
      token && dispatch(setAccessToken(token));
    }
  };

  /**
   * Dispatches anonymous Keycloak to Redux
   *
   * @param updatedKeycloak Keycloak
   */
  const updateAnonymousKeycloak = (updatedKeycloak?: Keycloak) => {
    updatedKeycloak && dispatch(anonymousLogin(updatedKeycloak));
  };

  /**
   * Begins token refresh interval
   */
  useInterval(() => refreshAuthentication(keycloak).then(updateKeycloak), 1000 * REFRESH_INTERVAL);
  useInterval(() => refreshAnonymousAuthentication(anonymousKeycloak).then(updateAnonymousKeycloak), 1000 * REFRESH_INTERVAL);

  if (adminLogin && !keycloak) {
    return null;
  }

  if (userLogin && !accessToken) {
    if (!keycloak) {
      return null;
    }

    return (
      <ConfirmDialog
        open
        onCancel={ () => navigate(-1) }
        onClose={ () => navigate(-1) }
        onConfirm={ () => loginKeycloak(keycloak) }
        cancelButtonText={ strings.generic.close }
        positiveButtonText={ strings.generic.confirm }
        title={ strings.protectedForm.redirectDialog.title }
        text={ strings.protectedForm.redirectDialog.text }
      />
    );
  }

  if (!accessToken && !anonymousAccessToken) {
    return null;
  }

  return <>{ children }</>;
};

export default AuthenticationProvider;