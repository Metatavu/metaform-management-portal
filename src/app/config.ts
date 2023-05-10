import { cleanEnv, email, str, url } from "envalid";
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
  REACT_APP_CORS_PROXY: str({ default: undefined }),
  REACT_APP_ANONYMOUS_USER: str(),
  REACT_APP_ANONYMOUS_PASSWORD: str(),
  REACT_APP_TUTORIAL_URL: str({ default: "" }),
  REACT_APP_DEFAULT_EXPORT_THEME_ID: str({ default: undefined }),
  REACT_APP_FORM_IDPHINT: str(),
  REACT_APP_EMAIL_FROM: email(),
  REACT_APP_EMAIL_URL: url(),
  REACT_APP_THEME_PALETTE_SECONDARY: str({ default: "#f9473b" }),
  REACT_APP_THEME_USE_COLORED_HEADER: str({ default: "true" }),
  REACT_APP_THEME_FONT_FAMILY_URL: url({ default: "https://fonts.googleapis.com/css2?family=Roboto&display=swap" }),
  REACT_APP_THEME_FONT_FAMILY: str({ default: "Roboto, sans-serif" }),
  REACT_APP_THEME_FAVICON_URL: url({ default: "https://metatavu.fi/wp-content/uploads/2021/06/cropped-metatavu-favicon.jpg" }),
  REACT_APP_THEME_LOGO_PATH: str({ default: "/images/metaform-logo.png" }),
  REACT_APP_THEME_FORMLOGO_PATH: str({ default: undefined }),
  REACT_APP_THEME_BACKGROUND_IMAGE_PATH: str({ default: undefined }),
  REACT_APP_THEME_BACKGROUND_COLOR: str({ default: undefined }),
  REACT_APP_THEME_TITLE: str({ default: "Metataform Management Portal" }),
  REACT_APP_SUPPORT_EMAIL: email({ default: "support@metatavu.fi" })
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
    },
    form: {
      idpHint: env.REACT_APP_FORM_IDPHINT
    },
    theme: {
      paletteSecondaryMain: env.REACT_APP_THEME_PALETTE_SECONDARY,
      useColoredHeader: env.REACT_APP_THEME_USE_COLORED_HEADER,
      fontFamilyUrl: env.REACT_APP_THEME_FONT_FAMILY_URL,
      fontFamily: env.REACT_APP_THEME_FONT_FAMILY,
      faviconUrl: env.REACT_APP_THEME_FAVICON_URL,
      logoPath: env.REACT_APP_THEME_LOGO_PATH,
      formLogoPath: env.REACT_APP_THEME_FORMLOGO_PATH,
      backgroundImagePath: env.REACT_APP_THEME_BACKGROUND_IMAGE_PATH,
      backgroundColor: env.REACT_APP_THEME_BACKGROUND_COLOR,
      title: env.REACT_APP_THEME_TITLE,
      supportEmail: env.REACT_APP_SUPPORT_EMAIL
    }
  });

  /**
   * Returns default export theme id
   *
   * @returns export theme id
   */
  public static getDefaultExportThemeId(): string {
    return env.REACT_APP_DEFAULT_EXPORT_THEME_ID;
  }

  /**
   * Returns tutorial url
   *
   * @returns tutorial url
   */
  public static getTutorialUrl(): string | undefined {
    return env.REACT_APP_TUTORIAL_URL;
  }

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
   * Returns address for CORS proxy service
   *
   * @returns address for CORS proxy service
   */
  public static getCorsProxy(): string {
    return env.REACT_APP_CORS_PROXY;
  }

  /**
  * Returns email from address for sending emails
  *
  * @returns email address for sending emails
  */
  public static getEmailFrom(): string {
    return env.REACT_APP_EMAIL_FROM;
  }

  /**
  * Returns email url address for sending emails
  *
  * @returns email address url for sending emails
  */
  public static getEmailUrl(): string {
    return env.REACT_APP_EMAIL_URL;
  }

  /**
   * Returns secondary palette color
   * 
   * @returns The secondary color of the theme
   */
  public static getPaletteSecondary(): string {
    return env.REACT_APP_THEME_PALETTE_SECONDARY;
  }

  /**
   * Whether to use colored header
   * 
   * @returns Whether to use colored header
   */
  public static getUseColoredHeader(): boolean {
    return env.REACT_APP_THEME_USE_COLORED_HEADER === "true";
  }

  /**
   * Returns font family url
   * 
   * @returns The font family url
   */
  public static getFontFamilyUrl(): string | undefined {
    return env.REACT_APP_THEME_FONT_FAMILY_URL;
  }

  /**
   * Returns font family
   * 
   * @returns The font family
   */
  public static getFontFamily(): string {
    return env.REACT_APP_THEME_FONT_FAMILY;
  }

  /**
   * Returns favicon url
   * 
   * @returns The favicon url
   */
  public static getFaviconUrl(): string | undefined {
    return env.REACT_APP_THEME_FAVICON_URL;
  }

  /**
   * Returns logo path
   * 
   * @returns The logo path
   */
  public static getLogoPath(): string | undefined {
    return env.REACT_APP_THEME_LOGO_PATH;
  }

  /**
   * Returns form logo path
   * 
   * @returns The form logo path
   */
  public static getFormLogoPath(): string | undefined {
    return env.REACT_APP_THEME_FORMLOGO_PATH;
  }

  /**
   * Returns background image path
   * 
   * @returns The background image path
   */
  public static getBackgroundImagePath(): string | undefined {
    return env.REACT_APP_THEME_BACKGROUND_IMAGE_PATH;
  }

  /**
   * Returns background color
   * 
   * @returns The background color
   */
  public static getBackgroundColor(): string | undefined {
    return env.REACT_APP_THEME_BACKGROUND_COLOR;
  }

  /**
   * Returns title
   * 
   * @returns The title
   */
  public static getTitle(): string | undefined {
    return env.REACT_APP_THEME_TITLE;
  }

  /**
   * Returns support email
   * 
   * @returns The support email
   */
  public static getSupportEmail(): string | undefined {
    return env.REACT_APP_SUPPORT_EMAIL;
  }

}