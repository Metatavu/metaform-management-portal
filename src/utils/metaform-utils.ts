import { AttachmentsApi, FieldRule, Metaform, MetaformField, MetaformFieldOption, MetaformFieldSourceType, MetaformFieldType, MetaformFromJSON, MetaformSection, MetaformSectionFromJSON, MetaformVersion, Reply } from "generated/client";
import { FieldValue } from "metaform-react/types";
import { Dictionary, MemberGroupPermission } from "types";
import strings from "localization/strings";
import { FormContext } from "../types/index";
import Holidays from "date-holidays";
import { CREATED_FIELD_NAME, MODIFIED_FIELD_NAME, STATUS_FIELD_NAME } from "consts";
import LocalizationUtils from "./localization-utils";
import { uuid4 } from "@sentry/utils";

const holiday = new Holidays("FI");

/**
 * Utility class for metaform
 */
namespace MetaformUtils {

  /**
   * Field types that allow user group
   */
  export const fieldTypesAllowUserGroup = [
    MetaformFieldType.Select,
    MetaformFieldType.DateTime,
    MetaformFieldType.Date,
    MetaformFieldType.Radio,
    MetaformFieldType.Checklist
  ];

  /**
   * Field types that allow visibility
   */
  export const fieldTypesAllowVisibility = [
    MetaformFieldType.Select,
    MetaformFieldType.Radio,
    MetaformFieldType.Checklist
  ];

  /**
   * Metadata fields names
   */
  const METADATA_FIELD_NAMES = [
    STATUS_FIELD_NAME,
    CREATED_FIELD_NAME,
    MODIFIED_FIELD_NAME
  ];

  /**
   * Gets metaform section
   *
   * @param form metaform
   * @param sectionId section id
   * @return metaform section
   */
  export const getMetaformSection = (form: Metaform, sectionId?: number): MetaformSection | undefined => {
    if (sectionId === undefined) {
      return undefined;
    }

    return form.sections?.[sectionId];
  };

  /**
   * Gets metaform field
   *
   * @param form metaform
   * @param fieldId field id
   * @param sectionId section id
   * @return metaform field
   */
  export const getMetaformField = (form: Metaform, sectionId?: number, fieldId?: number): MetaformField | undefined => {
    if (sectionId === undefined || fieldId === undefined) {
      return undefined;
    }

    return form.sections?.[sectionId]?.fields?.[fieldId];
  };

  /**
   * Create new Metaform
   *
   * @param formTitle Title of the metaform
   * @param allowAnonymousRule boolean to allow anonymous users to access the metaform
   * @returns new Metaform
   */
  export const createNewMetaform = (formTitle: string, allowAnonymousRule: boolean): Metaform => {
    return {
      title: formTitle,
      exportThemeId: undefined,
      allowAnonymous: allowAnonymousRule,
      allowDrafts: true, // TODO: Check if allowDrafts should be true by default
      allowReplyOwnerKeys: undefined,
      allowInvitations: undefined,
      autosave: undefined,
      slug: "form",
      defaultPermissionGroups: {
        viewGroupIds: [],
        editGroupIds: [],
        notifyGroupIds: []
      },
      sections: [
        {
          title: "Osion otsikko",
          visibleIf: undefined,
          fields: [
          ]
        }
      ],
      filters: [],
      scripts: undefined
    };
  };

  /**
   * Convert Object to metaform data
   *
   * @param metaformJson metaform data in json
   * @returns metaform data
   */
  export const jsonToMetaform = (metaformJson: Metaform): Metaform => {
    return MetaformFromJSON(metaformJson);
  };

  /**
   * Checks if field name on form is unique
   *
   * @param metaform metaform
   * @param name metaform field name
   * @returns boolean whether field name is unique
   */
  const checkIfFieldNameIsUnique = (metaform: Metaform, name: string) => {
    return !metaform.sections?.some(section => {
      return section.fields?.some(item => item.name === name);
    });
  };

  /**
   * Creates a random field name
   *
   * @param fieldType metaform field type
   * @returns random field name
   */
  const createFieldName = (fieldType: string) => {
    return `${fieldType}-${uuid4().slice(0, 5)}`;
  };

  /**
   * Create empty field for given field type
   * Name is given random name to avoid duplicated names
   *
   * @param fieldType metaform field type
   * @param title title
   * @param name name
   * @param required required
   * @param options options
   * @returns created field
   */
  export const createField = (
    fieldType: MetaformFieldType,
    metaform: Metaform,
    title?: string,
    name?: string,
    required?: boolean,
    options?: any[]
  ): MetaformField => {
    let uniqueFieldName: string = "";
    let nameFound = false;
    do {
      const nameToTest = createFieldName(fieldType);
      if (checkIfFieldNameIsUnique(metaform, nameToTest)) {
        uniqueFieldName = nameToTest;
        nameFound = true;
      }
    } while (!nameFound);
    switch (fieldType) {
      case MetaformFieldType.Select:
      case MetaformFieldType.Radio:
      case MetaformFieldType.Checklist:
        return {
          name: uniqueFieldName,
          title: title ?? LocalizationUtils.getLocalizedFieldType(fieldType),
          type: fieldType,
          required: required ?? false,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ],
          options: options ?? [
            {
              name: "option",
              text: "valinta",
              permissionGroups:
                {
                  viewGroupIds: [],
                  editGroupIds: [],
                  notifyGroupIds: []
                }
            }
          ]
        };
      case MetaformFieldType.Boolean:
        return {
          name: name ?? uniqueFieldName,
          title: title ?? LocalizationUtils.getLocalizedFieldType(fieldType),
          type: fieldType,
          required: required ?? false,
          checked: false,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ]
        };
      case MetaformFieldType.Slider:
        return {
          name: name ?? uniqueFieldName,
          title: title ?? LocalizationUtils.getLocalizedFieldType(fieldType),
          type: fieldType,
          required: required ?? false,
          min: 50,
          max: 100,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ]
        };
      case MetaformFieldType.Table:
        return {
          name: name ?? uniqueFieldName,
          title: title ?? LocalizationUtils.getLocalizedFieldType(fieldType),
          text: fieldType,
          type: fieldType,
          required: required ?? false,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ],
          table: {
            columns: options ?? [
              {
                type: "text",
                name: "column1",
                title: "Column 1"
              }
            ]
          }
        };
      case MetaformFieldType.Submit:
        return {
          title: "",
          name: name ?? uniqueFieldName,
          type: fieldType,
          text: strings.draftEditorScreen.editor.fields.submit ?? fieldType,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ]
        };
      case MetaformFieldType.Html:
        return {
          name: name ?? uniqueFieldName,
          title: title ?? LocalizationUtils.getLocalizedFieldType(fieldType),
          required: required ?? false,
          type: fieldType,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ]
        };
      case MetaformFieldType.Number:
        return {
          name: name ?? uniqueFieldName,
          title: title ?? LocalizationUtils.getLocalizedFieldType(fieldType),
          required: required ?? false,
          text: fieldType,
          min: undefined,
          max: undefined,
          type: fieldType,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ]
        };
      case MetaformFieldType.Date:
      case MetaformFieldType.DateTime:
        return {
          name: name ?? uniqueFieldName,
          title: title ?? LocalizationUtils.getLocalizedFieldType(fieldType),
          required: required ?? false,
          text: name ?? uniqueFieldName,
          type: fieldType,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ],
          allowPastDays: true
        };
      default:
        return {
          name: name ?? uniqueFieldName,
          title: title ?? LocalizationUtils.getLocalizedFieldType(fieldType),
          required: required ?? false,
          text: fieldType,
          type: fieldType,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ]
        };
    }
  };

  /**
   * Create an empty section
   *
   * @param title title
   * @param fields fields
   * @returns created section
   */
  export const createSection = (title?: string, fields?: any[]): MetaformSection => {
    return {
      title: title ?? strings.draftEditorScreen.editor.defaultSectionTitle,
      fields: fields ?? []
    };
  };

  /**
   * Sends a blob to user for downloading
   *
   * @param data data as blob
   * @param filename download file name
   */
  export const downloadBlob = (data: Blob, filename: string) => {
    const downloadLink = document.createElement("a");
    const downloadUrl = window.URL.createObjectURL(data);
    document.body.appendChild(downloadLink);
    downloadLink.href = downloadUrl;
    downloadLink.download = filename;
    downloadLink.click();
    window.URL.revokeObjectURL(downloadUrl);
    downloadLink.remove();
  };

  /**
   * Creates owner key protected reply edit link
   *
   * @param replyId reply id
   * @param ownerKey owner key
   * @returns owner key protected reply edit link
   */
  export const createOwnerKeyLink = (replyId: string, ownerKey: string) => {
    const { location } = window;
    return (new URL(`${location.protocol}//${location.hostname}:${location.port}?reply=${replyId}&owner-key=${ownerKey}`)).toString();
  };

  /**
   * Processes reply from server into form that is understood by ui
   *
   * @param foundMetaform metaform that is being viewed
   * @param foundReply reply loaded from server
   * @param currentOwnerKey owner key for the reply
   * @param attachmentsApi attachments api
   *
   * @return data processes to be used by ui
   */
  export const processReplyData = async (foundMetaform: Metaform, foundReply: Reply, attachmentsApi: AttachmentsApi, currentOwnerKey?: string) => {
    const values = { ...foundReply.data };
    // eslint-disable-next-line no-restricted-syntax
    for (const section of foundMetaform.sections || []) {
      // eslint-disable-next-line no-restricted-syntax
      for (const field of section.fields || []) {
        if (field && field.type === MetaformFieldType.Files && values && field.name && values[field.name]) {
          const fileIds = Array.isArray(values[field.name]) ? values[field.name] : [values[field.name]];
          const attachmentPromises = (fileIds as string[]).map(fileId => {
            return attachmentsApi.findAttachment({ attachmentId: fileId, ownerKey: currentOwnerKey });
          });

          // eslint-disable-next-line no-await-in-loop
          const attachments = await Promise.all(attachmentPromises);

          values[field.name] = {
            files: attachments.map(attachment => ({ ...attachment, persisted: true }))
          };
        }
      }
    }

    return values;
  };

  /**
   * Prepares form values for the form.
   *
   * @param metaformToPrepare metaform
   * @returns prepared form values
   */
  export const prepareFormValues = (
    metaformToPrepare: Metaform,
    formValues: Dictionary<FieldValue>,
    keycloak: Keycloak.KeycloakInstance | undefined
  ): Dictionary<FieldValue> => {
    const result = { ...formValues };

    metaformToPrepare.sections?.forEach(section => {
      section.fields?.forEach(field => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { name, _default, options, source } = field;

        if (name) {
          if (_default) {
            result[name] = _default;
          } else if (options && options.length) {
            const selectedOption = options.find(option => option.selected || option.checked);
            if (selectedOption) {
              result[name] = selectedOption.name;
            }
          }

          if (keycloak) {
            const { tokenParsed } = keycloak;

            if (source && source.type === MetaformFieldSourceType.AccessToken && tokenParsed) {
              const accessTokenAttribute = source.options?.accessTokenAttribute;
              const accessTokenValue = accessTokenAttribute ? (tokenParsed as any)[accessTokenAttribute] : null;
              if (accessTokenValue) {
                result[name] = accessTokenValue;
              }
            }
          }
        }
      });
    });

    return result;
  };

  /**
   * Create status field for new metaform
   *
   * @returns status field for form
   */
  export const createFormStatusField = (): MetaformField => {
    return {
      name: STATUS_FIELD_NAME,
      type: MetaformFieldType.Radio,
      options: [
        {
          name: "waiting",
          text: "Odottaa",
          checked: true
        },
        {
          name: "processing",
          text: "Käsittelyssä"
        },
        {
          name: "done",
          text: "Käsitelty"
        }
      ],
      contexts: [
        FormContext.MANAGEMENT_LIST
      ],
      flags: {
        managementEditable: true
      },
      title: "Tila"
    };
  };

  /**
   * Create created field for new metaform
   *
   * @returns created field for form
   */
  export const createFormCreatedField = (): MetaformField => {
    return {
      name: CREATED_FIELD_NAME,
      title: "Luotu",
      type: MetaformFieldType.DateTime,
      contexts: [
        FormContext.META,
        FormContext.MANAGEMENT_LIST
      ],
      flags: {
        managementEditable: false
      }
    };
  };

  /**
   * Create modified field for new metaform
   *
   * @returns modified field for form
   */
  export const createFormModifiedField = (): MetaformField => {
    return {
      name: MODIFIED_FIELD_NAME,
      title: "Muokattu",
      type: MetaformFieldType.DateTime,
      contexts: [
        FormContext.META,
        FormContext.MANAGEMENT_LIST
      ],
      flags: {
        managementEditable: false
      }
    };
  };

  /**
   * Creates forms metadata fields
   * e.g. status, created and modified
   *
   * @returns MetaformField[]
   */
  export const createFormsMetadataFields = () => {
    return [
      createFormStatusField(),
      createFormModifiedField(),
      createFormCreatedField()
    ];
  };

  /**
   * Filter out metadata fields from form
   *
   * @param form Metaform form
   * @returns Metaform without metadata fields
   */
  export const removeStatusFieldFromForm = (form: Metaform) => {
    const sectionsWithoutStatusField = form.sections?.map(section => {
      const hasNoMetadataFields = section?.fields?.filter(field => !METADATA_FIELD_NAMES.includes(field.name!));
      const newSection = MetaformSectionFromJSON(section);
      newSection.fields = hasNoMetadataFields;
      return newSection;
    });
    const newForm: Metaform = jsonToMetaform(form);
    newForm.sections = sectionsWithoutStatusField?.length ? sectionsWithoutStatusField : newForm.sections;
    return newForm;
  };

  /**
   * Get draft form based on existing metaform version or new
   *
   * @returns Metaform
   */
  export const getDraftForm = (metaformVersion: MetaformVersion | undefined) => {
    return metaformVersion?.data === undefined ?
      MetaformUtils.jsonToMetaform({}) :
      MetaformUtils.removeStatusFieldFromForm(metaformVersion?.data);
  };

  /**
   * Finds field rules that matches
   *
   * @param fieldRule field rule
   * @param match match
   * @param foundFieldRules found field rule list
   * @param fieldOptionMatch field option match
   */
  export const fieldRuleScan = (fieldRule: FieldRule, fieldNameMatch: string, foundFieldRules: FieldRule[], fieldOptionMatch?: MetaformFieldOption) => {
    if (fieldRule.field === fieldNameMatch) {
      if (fieldOptionMatch !== undefined) {
        if (fieldOptionMatch.name === fieldRule.equals || fieldOptionMatch.name === fieldRule.notEquals) {
          foundFieldRules.push(fieldRule);
        }
      } else {
        foundFieldRules.push(fieldRule);
      }
    }

    fieldRule.and?.forEach(rule => fieldRuleScan(rule, fieldNameMatch, foundFieldRules, fieldOptionMatch));
    fieldRule.or?.forEach(rule => fieldRuleScan(rule, fieldNameMatch, foundFieldRules, fieldOptionMatch));
  };

  /**
   * Checks field rules that matches
   *
   * @param fieldRule field rule
   * @param match match
   * @param fieldOptionMatch field option match
   * @return boolean whether field rule was matched
   */
  export const fieldRuleMatch = (fieldRule: FieldRule, match: string, fieldOptionMatch?: MetaformFieldOption): boolean => {
    if (fieldRule.field === match) {
      if (fieldOptionMatch) {
        if (fieldOptionMatch.name === fieldRule.equals || fieldOptionMatch.name === fieldRule.notEquals) {
          return true;
        }
      }
      return true;
    }

    return !!fieldRule.and?.some(rule => fieldRuleMatch(rule, match, fieldOptionMatch)) ||
    !!fieldRule.or?.some(rule => fieldRuleMatch(rule, match, fieldOptionMatch));
  };

  /**
   * Checks is a day holiday
   *
   * @param workDaysOnly work days only
   * @return boolean on should the day be disabled
   */
  export const shouldDisableHolidays = (workDaysOnly: boolean) => (date: Date): boolean => {
    if (!workDaysOnly) {
      return false;
    }

    return [0, 6].includes(date.getDay()) || !!holiday.isHoliday(date);
  };

  /**
   * Gets option permission group
   *
   * @param option metaform field option
   * @return a (groupId, permission) tuple, undefined if no permission defined
   */
  export const getOptionPermissionGroup = (option: MetaformFieldOption): [ string, MemberGroupPermission ] | undefined => {
    if (option.permissionGroups === undefined) {
      return undefined;
    }
    const { permissionGroups } = option;

    if (permissionGroups.editGroupIds?.length) {
      return [ permissionGroups.editGroupIds[0], MemberGroupPermission.EDIT ];
    } if (permissionGroups.viewGroupIds?.length) {
      return [ permissionGroups.viewGroupIds[0], MemberGroupPermission.VIEW ];
    } if (permissionGroups.notifyGroupIds?.length) {
      return [ permissionGroups.notifyGroupIds[0], MemberGroupPermission.NOTIFY ];
    }

    return undefined;
  };

  /**
   * Removes permissionGroups from object
   *
   * @param obj any
   * @returns Metaform
   */
  export const removePermissionGroups = (obj: any): Metaform => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        if (key === "permissionGroups" && typeof obj[key] === "object") {
          delete obj[key];
        } else if (typeof obj[key] === "object") {
          obj[key] = removePermissionGroups(obj[key]);
        }
      }
    }
    return obj;
  };
}

export default MetaformUtils;