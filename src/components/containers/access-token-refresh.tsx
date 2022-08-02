/* eslint-disable react/jsx-no-useless-fragment */
import React from "react";
import Keycloak from "keycloak-js";
import { login, selectKeycloak } from "features/auth-slice";
import { useAppDispatch, useAppSelector, useInterval } from "app/hooks";
import Config from "app/config";
import jwt_decode from "jwt-decode";
import { AccessToken } from "types";
import * as querystring from "query-string";
import { useLocation } from "react-router-dom";

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
  const keycloak = useAppSelector(selectKeycloak);
  const dispatch = useAppDispatch();
  const location = useLocation();

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
      const anonymousLogin = Config.get().anonymousUser;
      const authConfig = Config.get().auth;
      const keycloakInstance = Keycloak(authConfig);
      
      const response = await fetch(`${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/token`, {
        method: "POST",
        body: querystring.stringify({
          grant_type: "password",
          username: anonymousLogin.username,
          password: anonymousLogin.password,
          client_id: authConfig.clientId
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      const accessToken = buildToken(await response.json());
      
      await keycloakInstance.init({
        token: accessToken.access_token,
        refreshToken: accessToken.refresh_token,
        checkLoginIframe: false
      });

      await keycloakInstance.loadUserProfile();
      dispatch(login(keycloakInstance));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  /**
   * Starts the login process. Used for /admin routes.
   */
  const initializeLogin = async () => {
    try {
      const authConfig = Config.get().auth;
      const keycloakInstance = Keycloak(authConfig);
      await keycloakInstance.init({ onLoad: "login-required", checkLoginIframe: false });
      await keycloakInstance.loadUserProfile();
      dispatch(login(keycloakInstance));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  /**
   * Refreshes authentication
   */
  const refreshAuthentication = async () => {
    try {
      if (!keycloak?.authenticated) {
        throw new Error("Not authenticated");
      }

      await keycloak.updateToken(70);
      dispatch(login(keycloak));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  /**
   * Initializes authentication
   */
  React.useEffect(() => {
    if (!keycloak && !location.pathname.startsWith("/admin")) {
      initializeAnonymousAuthentication();
    }
  }, []);

  React.useEffect(() => {
    if (!keycloak && location.pathname.startsWith("/admin")) {
      initializeLogin();
    }
  }, [location]);

  /**
   * Begins token refresh interval
   */
  useInterval(refreshAuthentication, 1000 * 60);

  if (!keycloak?.token) return null;

  return <>{ children }</>;
};

export default AuthenticationProvider;