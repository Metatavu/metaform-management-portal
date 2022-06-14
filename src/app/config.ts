import { cleanEnv, str, url } from "envalid";
import { Configuration } from "types";

/**
 * Validates that environment variables are in place and have correct form
 */
const env = cleanEnv(process.env, {
  REACT_APP_KEYCLOAK_URL: url(),
  REACT_APP_KEYCLOAK_REALM: str(),
  REACT_APP_KEYCLOAK_CLIENT_ID: str(),
  REACT_APP_API_BASE_URL: url()
});

/**
 * Class providing access to application configuration
 */
export default class Config {

  /**
   * Get static application configuration
   *
   * @returns promise of static application configuration
   */
  public static get = (): Configuration => ({
    auth: {
      url: env.REACT_APP_KEYCLOAK_URL,
      realm: env.REACT_APP_KEYCLOAK_REALM,
      clientId: env.REACT_APP_KEYCLOAK_CLIENT_ID
    },
    api: {
      baseUrl: env.REACT_APP_API_BASE_URL
    }
  });

}