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
    yes: string;
    no: string;
  };

  /**
   * Translations related to error handling
   */
  errorHandling: {
    title: string;
  };

  /**
   * Translations related to form component
   */
  formComponent: {
    datePicker: string;
    dateTimePicker: string;
  };

  /**
   * Translations related to header
   */
  header: {
    user: string;
    logo: string;
  };

  /**
   * Translations related to breadcrumb
   */
  breadcrumb: {
    home: string;
    users: string;
    editor: string;
    forms: string;
    data: string;
    list: string;
    answer: string;
    history: string;
  };

  /**
   * Translations related to navigation header
   */
  navigationHeader: {
    formsScreens: {
      title: string;
      description: string;
      formScreen: {
        title: string;
        description: string;
      };
      formDataScreen: {
        title: string;
        description: string;
      };
    };
    usersScreens: {
      title: string;
      description: string;
      button: {
        text: string
      }
    };
    editorScreens: {
      title: string;
      description: string;
      draftEditorScreen: {
        title: string;
        description: string;
      };
    };
  };

  /**
   * Translations related to metaform editor screen
   */
  draftEditorScreen: {
    preview: string;
    publish: string;
    editor: {
      addSection: string;
      emptySection: string;
      form: {
        tabTitle: string;
        formTitle: string;
      };
      fields: {
        tabTitle: string;
      };
      features: {
        tabTitle: string;
        title: string;
      };
      visibility: {
        tabTitle: string;
      };
    };
  };

  /**
   * Translations related to user management screen
   */
  userManagementScreen: {
    selector: {
      form: string;
      group: string;
      user: string;
    };
  };
}

/**
 * Initialized localized strings
 */
const strings: Localized = new LocalizedStrings({ en: en, fi: fi });

export default strings;