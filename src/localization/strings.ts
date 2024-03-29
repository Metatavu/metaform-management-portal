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
    login: string;
    notImplemented: string;
    save: string;
    yes: string;
    no: string;
    confirm: string;
    close: string;
    reload: string;
    show: string;
    addFilesText: string;
    back: string;
    actions: string;
    restore: string;
    unknown: string;
  };

  /**
   * Translations related to error handling
   */
  errorHandling: {
    title: string;
    authentication: string;
    dialog: {
      reloadPage: string;
      tryAgain: string;
      unsavedContents: string;
      reportIssue1: string;
      reportIssue2: string;
      technicalDetails: string;
      time: string;
      url: string;
      errorMessage: string;
    },
    accessControl: {
      contentNotPermitted: string;
    };
    adminFormsScreen: {
      listForms: string;
      listReplies: string;
      createForm: string;
      deleteVersion: string;
      createFormDuplicateNameError: string;
      convertSosmetaError: string;
      getLastModifiers: string;
      parsingJsonFile: string;
      jsonContainsNoSections: string;
    };
    draftEditorScreen: {
      findDraft: string;
      saveDraft: string;
      publishDraft: string;
      loadScripts: string;
      saveTemplate: string;
      fetchTemplates: string;
      deleteTemplate: string;
    };
    formScreen: {
      saveReply: string;
      sendReplyEmail: string;
      sendReplyDraftEmail: string;
      saveDraft: string;
      autosave: string;
      deleteReply: string;
      findMetaform: string;
      noConnection: string;
      noConnectionHelper: string;
      statisticsFailure: string;
      tryAgain: string;
    },
    formAutoComplete: {
      autocompleteField: string;
    };
    publicFormsScreen: {
      fetchForms: string;
    };
    adminRepliesScreen: {
      fetchReplies: string;
      fetchFields: string;
      deleteReply: string;
      formSlugNotFound: string;
      export: string;
    };
    adminReplyScreen: {
      saveReply: string;
      exportPdf: string;
      replyIdNotFound: string;
      fetchReply: string;
    };
    usersScreen: {
      loadMetaforms: string;
      loadMemberGroups: string;
      createMember: string;
      createMemberGroup: string;
      loadMembers: string;
      removeMemberNotFound: string;
      addMemberNotFound: string;
      loadUsers: string;
      createUser: string;
      updateUser: string;
    };
    previewScreen: {
      shareLink: string;
    };
    adminFormHistoryScreen: {
      listAuditLogEntries: string;
      listMetaformMembers: string;
      findMetaform: string;
    };
    adminFormsDataScreen: {
      listForms: string;
      listReplies: string;
      listAuditLogEntries: string;
    };
    scriptEditorScreen: {
      findScript: string;
      saveScript: string;
    }
  };

  /**
   * Translations related to protected forms
   */
  protectedForm: {
    redirectDialog: {
      title: string;
      text: string;
    }
  }

  /**
   * Translations related to form component
   */
  formComponent: {
    html: string;
    datePicker: string;
    dateTimePicker: string;
  };

  /**
   * Translations related to public forms screen
   */
  publicFormsScreen: {
    title: string;
    welcome: string;
    welcomeInfo: string;
    backToEssote: string;
  }

  /**
   * Translations related to header
   */
  header: {
    user: string;
    logo: string;
    selectLanguage: string;
    infoLabel: string;
    languages: {
      fi: string;
      en: string;
    }
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
    answers: string;
    history: string;
    scripts: string;
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
      formsDataScreen: {
        title: string;
        description: string;
      };
      formRepliesScreen: {
        title: string;
        description: string;
      },
      formHistoryScreen: {
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
      };
      draftEditorScreen: {
        title: string;
        description: string;
      };
      newFormButton: string;
    };
    scriptsScreens: {
      title: string;
      description: string;
      newScriptButton: string;
      scriptsScreen: {
        title: string;
        description: string;
      };
    }
  };

  /**
   * Translations related to metaform replies screen
   */
  repliesScreen: {
    open: string;
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
    export: string;
  }

  /**
   * Translations related to admin single reply screen
   */
  replyScreen: {
    exportPdf: string;
    selectStatus: string;
  }

  /**
   * Translations related to metaform editor screen
   */
  draftEditorScreen: {
    preview: string;
    publish: string;
    saveTemplate: string;
    deleteTemplate: string;
    exportToZip: string;
    publishDialog: {
      title: string;
      contentText: string;
    };
    editor: {
      addSection: string;
      emptySection: string;
      emptySelection: string;
      defaultSectionTitle: string;
      form: {
        tabTitle: string;
        formTitle: string;
        formSlugUrl: string;
        versionInfo: string;
        formVersion: string;
        formStyling: string;
        formVisibility: string;
        formVisibilityLabel: string;
        private: string;
        public: string;
        tooltipDescription: string;
        publishNoMemberGroupsDescription: string;
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
        submit: string;
        tooltipDescription: string;
      };
      features: {
        tabTitle: string;
        title: string;
        section: {
          sectionData: string;
          sectionTitle: string;
        };
        field: {
          fieldData: string;
          fieldType: string;
          fieldProperties: string;
          fieldTitle: string;
          defineUserGroup: string;
          selectableFieldsInfo: string;
          required: string;
          addFieldsAsText: string;
          addFieldsAsTextHelper: string;
          updateFields: string;
          addFieldOption: string;
          addNewColumn: string;
          classifiers: string;
          addNewClassifier: string;
          calculateColumnSum: string;
          sumPostfix: string;
          addColumnType: string;
          columnTextType: string;
          columnNumberType: string;
          submitButtonText: string;
          newFieldOption: string;
          addCustomHtml: string;
          contextVisibilityInfo: string;
          workDaysOnly: string;
          allowPast: string;
          slider: {
            minValueLabel: string;
            maxValueLabel: string;
          },
          addNewOption: string;
        };
        tooltipDescription: string;
      };
      visibility: {
        tabTitle: string;
        fieldVisibility: string;
        visibilityCondition: string;
        conditionLabelTitle: string;
        conditionally: string;
        conditionalFieldValue: string;
        conditionalFieldInfo: string;
        conditionalFieldValueInfo: string;
        fieldDefiningCondition: string;
        selectField: string;
        selectVisibilityInfo: string;
        fieldConditionLabel: string;
        sectionConditionLabel: string;
        tooltipDescription: string;
        or: string;
        addVisibleOrButtonText: string;
        showConditionChain: string;
        closeConditionChain: string;
        allChoices: string;
        andConditionChainTerms: string;
        visibilityConditionTooltip: string;
      };
      schedule: {
        title: string;
        startDate: string;
        endDate: string;
      },
      memberGroups: {
        memberGroupDefineSettings: string;
        defaultMemberGroupInfo: string;
        defaultMemberGroupInfoLabel: string;
        memberGroupPermission: string;
        memberGroup: string;
        selectedMemberGroup: string;
        edit: string;
        view: string;
        fieldValueLabel: string;
        notifications: string;
        noMemberGroup: string;
        noPermission: string;
        noDefaultPermissionMemberGroup: string;
      };
    };
    formPreview: {
      exit: string;
      shareLink: string;
      shareLinkDialog: {
        title: string;
        text: string;
        link: string;
        recipients: string;
        send: string;
        linkCopied: string;
      };
      previewEmail: {
        subject: string;
        content: string;
        emailSent: string;
        noTitle: string;
      };
    };
    scripts: {
      scripts: string;
      addNewScript: string;
      noScripts: string;
    }
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
    editMemberButton: string;
    addMemberButton: string;
    addMemberGroupButton: string;
    addMemberDialog: {
      title: string;
      text: string;
      addNewUserText: string;
      freeTextSearchLabel: string;
      usersSelectLabel: string;
      searchButton: string;
      emailLabel: string;
      firstNameLabel: string;
      lastNameLabel: string;
      upnNumberLabel: string;
      createButton: string;
      cancelButton: string;
      tooltip: {
        tooltipGeneral: string;
        tooltipNoIconDescription: string;
        tooltipLinkIconDescription: string;
        tooltipCardIconDescription: string;
      };
    };
    addMemberGroupDialog: {
      title: string;
      text: string;
      displayNameLabel: string;
      createButton: string;
      cancelButton: string;
    };
    editMemberDialog: {
      title: string;
      text: string;
      freeTextSearchLabel: string;
      metaformUsersSelectLabel: string;
      cardAuthUsersSelectLabel: string;
      userIsLinked: string;
      searchButton: string;
      emailLabel: string;
      firstNameLabel: string;
      lastNameLabel: string;
      upnNumberLabel: string;
      cancelButton: string;
      editButton: string;
      tooltip: {
        tooltipGeneral: string;
      };
    };
    usersTable: {
      nameColumn: {
        label: string;
      };
      emailColumn: {
        label: string;
      };
      groupsColumn: {
        label: string;
      };
    };
  };

  /**
   * Translations related to form history screen
   */
  formHistoryScreen: {
    historyTable: {
      date: string;
      actor: string;
      replyId: string;
      actionPerformed: string;
    };
  }

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
   * Translations related to forms screen
   */
  formsScreen: {
    formTable: {
      form: string;
      latestReply: string;
      newReply: string;
      notProcessed: string;
    };
  }

  /**
   * Translations related to forms screen
   */
  formsDataScreen: {
    formDataTable: {
      form: string;
      monthlyReplies: string;
      processingDelay: string;
      average: string;
      delayFormat: string;
    };
  }

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
    formLastModifierNotFound: string;
    formVersionArchived: string;
    formVersionDraft: string;
    formProductionVersion: string;
    drawer: {
      newForm: string;
      importJson: string,
      importedFileName: string,
      helper: string;
      formInfo: string;
      formName: string;
      formUrl: string;
      formTemplate: string;
      formTemplates: string;
      formTemplateSelect: string;
      noFormTemplateSelected: string;
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
   * Translations related to template dialog
   */
  templateDialog: {
    title: string;
    input: string;
    text: string;
    unique: string;
  }

  /**
   * Autocomplete related messages
   */
  autoComplete: {
    missingOptions: string;
    missingCodeServerBaseUrl: string;
    missingCodeServerClassificationId: string;
    missingCodeServerParentConceptCodeId: string;
    missingAutocomplete: string;
    unknownAutocompleteService: string;
  }

  /**
   * Translations related to audit log entry type
   */
  auditLogEntryType: {
    viewReply: string;
    listReply: string;
    modifyReply: string;
    deleteReply: string;
    createReply: string;
    viewReplyAttachment: string;
    downloadReplyAttachment: string;
    exportReplyPdf: string;
    exportReplyXlsx: string
  }

  /**
   * Translation related to form context
   */
  formContext: {
    management: string;
    managementList: string;
    form: string;
  }

  /**
   * Translation related to datagrid
   */
  dataGrid: {
    rowsPerPage: string;
  }

  /**
   * Translation related to success snackbars
   */
  successSnackbars: {
    formEditor: {
      deleteFormSuccessText: string;
      deleteFormVersionSuccessText: string;
      createFormSuccessText: string;
      restoreArchiveFormSuccessText: string;
      convertSchemaSuccessText: string;
    };
    draftEditor: {
      saveDraftSuccessText: string;
      publishDraftSuccessText: string;
      saveTemplateSuccessText: string;
      deleteTemplateSuccessText: string;
    };
    users: {
      editUserSuccessText: string;
      addMemberGroupSuccessText: string;
      addMemberSuccessText: string;
      groupMembershipAddSuccessText: string;
      groupMembershipRemoveSuccessText: string;
    };
    replies: {
      replyDeleteSuccessText: string;
      replyEditSuccessText: string;
    }
  }

  scriptsScreen: {
    scriptsTable: {
      script: string;
      delete: string;
    }
  }

  scriptEditorScreen: {
    scriptName: string;
    scriptType: string;
    scriptContent: string;
    saveScript: string;
  }

  /**
   * Traslations related to features
   */
  features: {
    sosMeta: {
      title: string;
      description: string;
    };
    formUsageStatistics: {
      title: string;
      description: string;
    };
    auditLog: {
      title: string;
      description: string;
    };
    strongAuthentication: {
      title: string;
      description: string;
    };
    excelExport: {
      title: string;
      description: string;
    };
    advancedPermissionTargeting: {
      title: string;
      description: string;
    };
    askForMoreInfo: string;

  }
}
/**
 * Initialized localized strings
 */
const strings: Localized = new LocalizedStrings({ en: en, fi: fi });

export default strings;