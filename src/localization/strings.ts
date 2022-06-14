import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";
import en from "./en.json";
import fi from "./fi.json";

/**
 * Localized strings
 */
export interface Localized extends LocalizedStringsMethods {

  /**
   * Translations related to generic words
   */
  generic: {
    cancel: string;
    delete: string;
    edit: string;
    logout: string;
    notImplemented: string;
    save: string;
  };

  /**
   * Translations related to error handling
   */
  errorHandling: {
    title: string;
  };

}

/**
 * Initialized localized strings
 */
const strings: Localized = new LocalizedStrings({ en: en, fi: fi });

export default strings;