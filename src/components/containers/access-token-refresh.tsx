/* eslint-disable react/jsx-no-useless-fragment */
import React from "react";
import Keycloak from "keycloak-js";
import { login, selectKeycloak } from "features/auth-slice";
import { useAppDispatch, useAppSelector, useInterval } from "app/hooks";
import Config from "app/config";

/**
 * Component for handling authentication with Keycloak
 */
const AuthenticationProvider: React.FC = ({ children }) => {
  const keycloak = useAppSelector(selectKeycloak);
  const dispatch = useAppDispatch();

  /**
   * Initializes Keycloak authentication
   */
  const initializeAuthentication = async () => {
    try {
      const keycloakInstance = Keycloak(Config.get().auth);

      await keycloakInstance.init({
        onLoad: "login-required",
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
  React.useEffect(() => { initializeAuthentication(); }, []);

  /**
   * Begins token refresh interval
   */
  useInterval(refreshAuthentication, 1000 * 60);

  if (!keycloak?.token) return null;

  return <>{ children }</>;
};

export default AuthenticationProvider;