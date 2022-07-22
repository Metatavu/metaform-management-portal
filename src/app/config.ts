import { cleanEnv, str, url } from "envalid";
import { Configuration } from "types";

/**
 * Validates that environment variables are in place and have correct form
 */
const env = cleanEnv(process.env, {
  REACT_APP_KEYCLOAK_URL: url({ default: undefined }),
  REACT_APP_KEYCLOAK_REALM: str({ default: undefined }),
  REACT_APP_KEYCLOAK_CLIENT_ID: str({ default: undefined }),
  REACT_APP_API_BASE_URL: url({ default: undefined }),
  REACT_APP_SENTRY_DSN: url({ default: undefined }),
  REACT_APP_SENTRY_ENVIRONMENT: str({ default: "production" }),
  REACT_APP_ANONYMOUS_USER: str(),
  REACT_APP_ANONYMOUS_PASSWORD: str(),
  REACT_APP_FORM_ID: str()
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
    anonymousUser: {
      username: env.REACT_APP_ANONYMOUS_USER,
      password: env.REACT_APP_ANONYMOUS_PASSWORD
    },
    api: {
      baseUrl: env.REACT_APP_API_BASE_URL
    }
  });

  /**
   * Returns sentry dsn
   * 
   * @returns sentry dsn
   */
  public static getSentryDsn(): string | undefined {
    return env.REACT_APP_SENTRY_DSN;
  }

  /**
   * Returns sentry environment
   * 
   * @returns sentry environment
   */
  public static getSentryEnvironment(): string {
    return env.REACT_APP_SENTRY_ENVIRONMENT;
  }

  /**
   * Returns used metaform id
   * 
   * @returns metaform id
   */
  public static getMetaformId = () => {
    return env.REACT_APP_FORM_ID;
  };

}