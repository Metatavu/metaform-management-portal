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
    confirm: string;
  };

  /**
   * Translations related to error handling
   */
  errorHandling: {
    title: string;
    formScreen: {
      saveReply: string;
      sendReplyEmail: string;
      sendReplyDraftEmail: string;
    }
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
        form: {
          form: string;
          latestReply: string;
          newReply: string;
          notProcessed: string;
          answerScreen: {
            title: string;
            description: string;
            createdColumnTitle: string;
            modifiedColumnTitle: string;
            statusColumnTitle: string;
            nameColumnTitle: string;
            selectorShowOpen: string;
            selectorShowAll: string;
            statusWaiting: string;
            statusInProgress: string;
            statusProgressed: string;
          }
        }
      };
      formDataScreen: {
        title: string;
        description: string;
      };
    };
    usersScreens: {
      title: string;
      description: string;
      subheader: {
        "title": string;
        "description": string;
      }
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

  /**
   * Translations related to field components
   */
  fieldComponents: {
    tableField: {
      addNewRow: string;
      unknownColumnType: string;
    };
  };

  /**
   * Translations related to form screen
   */
  formScreen: {
    replyEditEmailSubject: string;
    replyEditEmailContent: string;
    replyEditEmailSent: string;
    saveDraft: string;
    saveDraftLink: string;
    draftEmailSubject: string;
    draftEmailContent: string;
    draftEmailSent: string;
    draftSaved: string;
    draftEmailText: string;
    draftEmailLink: string;
    autosaving: string;
    draftEmailDialogText: string;
    replySaved: string;
    replyEdit: string;
    replyEditEmailText: string;
    replyEditEmailLink: string;
    replyEditEmailDialogText: string;
    replyDeleteText: string;
    replyDeleteLink: string;
    confirmDeleteReplyTitle: string;
    confirmDeleteReplyText: string;
    replyNotFound: string;
    replyDeleted: string;
  };

  /**
   * Translations related to email dialogs 
   */
  emailDialog: {
    title: string;
    email: string;
    cancel: string;
    send: string;
  }
}

/**
 * Initialized localized strings
 */
const strings: Localized = new LocalizedStrings({ en: en, fi: fi });

export default strings;