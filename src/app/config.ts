import { cleanEnv, email, str, url } from "envalid";
import { Configuration } from "types";

/**
 * Validates that environment variables are in place and have correct form
 */
const env = cleanEnv(import.meta.env, {
  VITE_APP_KEYCLOAK_URL: url({ default: undefined }),
  VITE_APP_KEYCLOAK_REALM: str({ default: undefined }),
  VITE_APP_KEYCLOAK_CLIENT_ID: str({ default: undefined }),
  VITE_APP_API_BASE_URL: url({ default: undefined }),
  VITE_APP_SENTRY_DSN: url({ default: undefined }),
  VITE_APP_SENTRY_ENVIRONMENT: str({ default: "production" }),
  VITE_APP_CORS_PROXY: str({ default: undefined }),
  VITE_APP_ANONYMOUS_USER: str(),
  VITE_APP_ANONYMOUS_PASSWORD: str(),
  VITE_APP_TUTORIAL_URL: str({ default: "" }),
  VITE_APP_DEFAULT_EXPORT_THEME_ID: str({ default: undefined }),
  VITE_APP_FORM_IDPHINT: str(),
  VITE_APP_EMAIL_FROM: email(),
  VITE_APP_EMAIL_URL: url(),
  VITE_APP_THEME_PALETTE_SECONDARY: str({ default: "#f9473b" }),
  VITE_APP_THEME_USE_COLORED_HEADER: str({ default: undefined }),
  VITE_APP_THEME_FONT_FAMILY_URL: url({ default: "https://fonts.googleapis.com/css2?family=Roboto&display=swap" }),
  VITE_APP_THEME_FONT_FAMILY: str({ default: "Roboto, sans-serif" }),
  VITE_APP_THEME_FAVICON_URL: url({ default: "https://metatavu.fi/wp-content/uploads/2021/06/cropped-metatavu-favicon.jpg" }),
  VITE_APP_THEME_LOGO_PATH: str({ default: "/images/metaform-logo.png" }),
  VITE_APP_THEME_FORMLOGO_PATH: str({ default: undefined }),
  VITE_APP_THEME_BACKGROUND_IMAGE_PATH: str({ default: undefined }),
  VITE_APP_THEME_BACKGROUND_COLOR: str({ default: undefined }),
  VITE_APP_THEME_TITLE: str({ default: "Metataform Management Portal" }),
  VITE_APP_SUPPORT_EMAIL: email({ default: "support@metatavu.fi" }),
  VITE_APP_METAFORM_FEATURES: str({ default: "[]" }),
  VITE_APP_LEAVE_SITE_URL: url({ default: undefined }),
  VITE_APP_FEATURE_CONTACT_EMAIL: str({ default: undefined })
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
      url: env.VITE_APP_KEYCLOAK_URL,
      realm: env.VITE_APP_KEYCLOAK_REALM,
      clientId: env.VITE_APP_KEYCLOAK_CLIENT_ID
    },
    anonymousUser: {
      username: env.VITE_APP_ANONYMOUS_USER,
      password: env.VITE_APP_ANONYMOUS_PASSWORD
    },
    api: {
      baseUrl: env.VITE_APP_API_BASE_URL
    },
    form: {
      idpHint: env.VITE_APP_FORM_IDPHINT
    },
    theme: {
      paletteSecondaryMain: env.VITE_APP_THEME_PALETTE_SECONDARY,
      useColoredHeader: env.VITE_APP_THEME_USE_COLORED_HEADER,
      fontFamilyUrl: env.VITE_APP_THEME_FONT_FAMILY_URL,
      fontFamily: env.VITE_APP_THEME_FONT_FAMILY,
      faviconUrl: env.VITE_APP_THEME_FAVICON_URL,
      logoPath: env.VITE_APP_THEME_LOGO_PATH,
      formLogoPath: env.VITE_APP_THEME_FORMLOGO_PATH,
      backgroundImagePath: env.VITE_APP_THEME_BACKGROUND_IMAGE_PATH,
      backgroundColor: env.VITE_APP_THEME_BACKGROUND_COLOR,
      title: env.VITE_APP_THEME_TITLE,
      supportEmail: env.VITE_APP_SUPPORT_EMAIL,
      leaveSiteUrl: env.VITE_APP_LEAVE_SITE_URL
    },
    features: env.VITE_APP_METAFORM_FEATURES,
    featureContactEmail: env.VITE_APP_FEATURE_CONTACT_EMAIL
  });

  /**
   * Returns default export theme id
   *
   * @returns export theme id
   */
  public static getDefaultExportThemeId(): string {
    return env.VITE_APP_DEFAULT_EXPORT_THEME_ID;
  }

  /**
   * Returns tutorial url
   *
   * @returns tutorial url
   */
  public static getTutorialUrl(): string | undefined {
    return env.VITE_APP_TUTORIAL_URL;
  }

  /**
   * Returns sentry dsn
   *
   * @returns sentry dsn
   */
  public static getSentryDsn(): string | undefined {
    return env.VITE_APP_SENTRY_DSN;
  }

  /**
   * Returns sentry environment
   *
   * @returns sentry environment
   */
  public static getSentryEnvironment(): string {
    return env.VITE_APP_SENTRY_ENVIRONMENT;
  }

  /**
   * Returns address for CORS proxy service
   *
   * @returns address for CORS proxy service
   */
  public static getCorsProxy(): string {
    return env.VITE_APP_CORS_PROXY;
  }

  /**
  * Returns email from address for sending emails
  *
  * @returns email address for sending emails
  */
  public static getEmailFrom(): string {
    return env.VITE_APP_EMAIL_FROM;
  }

  /**
  * Returns email url address for sending emails
  *
  * @returns email address url for sending emails
  */
  public static getEmailUrl(): string {
    return env.VITE_APP_EMAIL_URL;
  }

  /**
   * Returns secondary palette color
   * 
   * @returns The secondary color of the theme
   */
  public static getPaletteSecondary(): string {
    return env.VITE_APP_THEME_PALETTE_SECONDARY;
  }

  /**
   * Whether to use colored header
   * 
   * @returns Whether to use colored header
   */
  public static getUseColoredHeader(): boolean {
    return env.VITE_APP_THEME_USE_COLORED_HEADER === "true";
  }

  /**
   * Returns font family url
   * 
   * @returns The font family url
   */
  public static getFontFamilyUrl(): string | undefined {
    return env.VITE_APP_THEME_FONT_FAMILY_URL;
  }

  /**
   * Returns font family
   * 
   * @returns The font family
   */
  public static getFontFamily(): string {
    return env.VITE_APP_THEME_FONT_FAMILY;
  }

  /**
   * Returns favicon url
   * 
   * @returns The favicon url
   */
  public static getFaviconUrl(): string | undefined {
    return env.VITE_APP_THEME_FAVICON_URL;
  }

  /**
   * Returns logo path
   * 
   * @returns The logo path
   */
  public static getLogoPath(): string | undefined {
    return env.VITE_APP_THEME_LOGO_PATH;
  }

  /**
   * Returns form logo path
   * 
   * @returns The form logo path
   */
  public static getFormLogoPath(): string | undefined {
    return env.VITE_APP_THEME_FORMLOGO_PATH;
  }

  /**
   * Returns background image path
   * 
   * @returns The background image path
   */
  public static getBackgroundImagePath(): string | undefined {
    return env.VITE_APP_THEME_BACKGROUND_IMAGE_PATH;
  }

  /**
   * Returns background color
   * 
   * @returns The background color
   */
  public static getBackgroundColor(): string | undefined {
    return env.VITE_APP_THEME_BACKGROUND_COLOR;
  }

  /**
   * Returns title
   * 
   * @returns The title
   */
  public static getTitle(): string | undefined {
    return env.VITE_APP_THEME_TITLE;
  }

  /**
   * Returns support email
   * 
   * @returns The support email
   */
  public static getSupportEmail(): string | undefined {
    return env.VITE_APP_SUPPORT_EMAIL;
  }

  /**
   * Returns leave site url
   * 
   * @returns The leave site url
   */
  public static getLeaveSiteUrl(): string | undefined {
    return env.VITE_APP_LEAVE_SITE_URL;
  }

  /**
   * Returns metaform features
   * 
   * @returns The Metaform features
   */
  public static getMetaformFeatures(): string | undefined {
    return JSON.parse(env.VITE_APP_METAFORM_FEATURES);
  }

  /**
   * Returns feature contact email
   * 
   * @returns The feature contact email
   */
  public static getFeatureContactEmail(): string | undefined {
    return env.VITE_APP_FEATURE_CONTACT_EMAIL;
  }

}