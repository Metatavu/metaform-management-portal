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
    loadingAutoCompleteOptions: string;
    cancel: string;
    delete: string;
    edit: string;
    logout: string;
    notImplemented: string;
    save: string;
    yes: string;
    no: string;
    confirm: string;
    close: string;
    reload: string;
    show: string;
    addFilesText: string;
  };

  /**
   * Translations related to error handling
   */
  errorHandling: {
    title: string;
    authentication: string;
    dialog: {
      reloadPage: string;
      unsavedContents: string;
      reportIssue: string;
      technicalDetails: string;
      time: string;
      url: string;
      errorMessage: string;
    },
    adminFormsScreen: {
      listForms: string;
      createForm: string;
      deleteVersion: string;
      createFormDuplicateNameError: string;
    },
    formScreen: {
      saveReply: string;
      sendReplyEmail: string;
      sendReplyDraftEmail: string;
      saveDraft: string;
      autosave: string;
      deleteReply: string;
      findMetaform: string;
    },
    formAutoComplete: {
      autocompleteField: string;
    },
    publicFormsScreen: {
      fetchForms: string;
    },
    adminRepliesScreen: {
      fetchReplies: string;
      fetchFields: string;
      deleteReply: string;
      formIdNotFound: string;
    }
    usersScreen: {
      loadMetaforms: string;
      loadMemberGroups: string;
      createMember: string;
      createMemberGroup: string;
      loadMembers: string;
      removeMemberNotFound: string;
      addMemberNotFound: string;
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
   * Translations related to public forms screen
   */
  publicFormsScreen: {
    title: string;
  }
  
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
        }
      };
      formListing: {
        form: string;
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
        title: string;
        description: string;
      }
    };
    editorScreens: {
      title: string;
      description: string;
      editorScreen: {
        title: string;
        description: string;
      },
      draftEditorScreen: {
        title: string;
        description: string;
      };
      newFormButton: string;
    };
  };

  /**
   * Translations related to metaform replies screen
   */
  repliesScreen: {
    title: string;
    description: string;
    createdColumnTitle: string;
    modifiedColumnTitle: string;
    statusColumnTitle: string;
    nameColumnTitle: string;
    selectorShowOpen: string;
    selectorShowAll: string;
    statusWaiting: string;
    statusProcessing: string;
    statusDone: string;
    confirmDeleteReplyTitle: string;
    confirmDeleteReplyText: string;
  }

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
        staticFields: string;
        selectorFields: string;
        inputFields: string;
        url: string;
        html: string;
        boolean: string;
        select: string;
        slider: string;
        checklist: string;
        radio: string;
        text: string;
        number: string;
        email: string;
        memo: string;
        date: string;
        dateAndTime: string;
        files: string;
        table: string;
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

    addMemberButton: string
    addMemberGroupButton: string
    addMemberDialog: {
      title: string
      text: string
      emailLabel: string
      firstNameLabel: string
      lastNameLabel: string
      createButton: string
      cancelButton: string
      roleAdministrator: string
      roleManager: string
    }
    addMemberGroupDialog: {
      title: string
      text: string
      displayNameLabel: string
      createButton: string
      cancelButton: string
    }
    usersTable: {
      nameColumn: {
        label: string
      }
      emailColumn: {
        label: string
      }
      groupsColumn: {
        label: string
      }
    }
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
    noTitle: string;
  };

  /**
   * Translations related to editor screen
   */
  editorScreen: {
    noMetaforms: string;
    formVersion: string;
    formCreatedAt: string;
    formModifiedAt: string;
    formLastModifier: string;
    formVersionArchived: string;
    formVersionDraft: string;
    drawer: {
      newForm: string;
      helper: string;
      formInfo: string;
      formName: string;
      formUrl: string;
      formTemplate: string;
      formTemplateCustom: string;
      formTemplateCustomHelper: string;
      formTemplateSosmeta: string;
      formTemplateSosmetaHelper: string;
      formTemplateSosmetaLink: string;
      formTemplateSchema: string;
      formIdentification: string;
      formIdentificationService: string;
      formIdentificationHelper: string;
      formIdentificationNone: string;
    };
    confirmDeleteVersionTitle: string;
    confirmDeleteVersionText: string;
    formProductionVersion: string;
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

  /**
 * Autocomplete related messages
 */
  autoComplete: {
    genericUnknown: string;
    missingOptions: string;
    missingCodeServerBaseUrl: string;
    missingCodeServerClassificiationId: string;
    missingCodeServerParentConceptCodeId: string;
    missingAutocomplete: string;
    unknownAutocompleteService: string;
  }
}
/**
 * Initialized localized strings
 */
const strings: Localized = new LocalizedStrings({ en: en, fi: fi });

export default strings;