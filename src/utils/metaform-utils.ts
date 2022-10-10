import Api from "api";
import { AttachmentsApi, AuditLogEntry, AuditLogEntryType, Metaform, FieldRule, MetaformField, MetaformFieldOption, MetaformFieldSourceType, MetaformFieldType, MetaformSection, MetaformVersion, Reply } from "generated/client";
import { FieldValue } from "metaform-react/types";
import { Dictionary, ReplyAuditLog, ReplyStatus } from "types";
import strings from "localization/strings";
import moment from "moment";
import { FormContext } from "../types/index";

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
   * Convert metaform to json format
   *
   * @param metaform metaform data
   * @returns metaform in json format
   */
  export const metaformToJson = (metaform: Metaform): string => {
    return metaform ? JSON.stringify(metaform, null, 2) : "";
  };

  /**
   * Convert Object to metaform data
   *
   * @param metaformJson metaform data in json
   * @returns metaform data
   */
  export const jsonToMetaform = (metaformJson: Object): Metaform => {
    return {
      ...JSON.parse(JSON.stringify(metaformJson))
    } as Metaform;
  };

  /**
   * Create empty field for given field type
   *
   * @param fieldType metaform field type
   * @param title title
   * @param name name
   * @param required required
   * @param options options
   * @returns created field
   */
  export const createField = (fieldType: MetaformFieldType, title?: string, name?: string, required?: boolean, options?: any[]): MetaformField => {
    switch (fieldType) {
      case MetaformFieldType.Select:
      case MetaformFieldType.Radio:
      case MetaformFieldType.Checklist:
        return {
          name: name ?? fieldType,
          title: title ?? fieldType,
          type: fieldType,
          required: required ?? false,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ],
          options: options ?? [
            {
              name: "option",
              text: "option1"
            }
          ]
        };
      case MetaformFieldType.Boolean:
        return {
          name: name ?? fieldType,
          title: title ?? fieldType,
          type: fieldType,
          required: required ?? false,
          checked: false,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ]
        };
      case MetaformFieldType.Slider:
        return {
          name: name ?? fieldType,
          title: title ?? fieldType,
          type: fieldType,
          required: required ?? false,
          min: 50,
          max: 100,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ]
        };
      case MetaformFieldType.Table:
        return {
          name: name ?? fieldType,
          title: title ?? fieldType,
          text: fieldType,
          type: fieldType,
          required: required ?? false,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ],
          columns: options ?? [
            {
              type: "text",
              name: "column1",
              title: "Column 1"
            }
          ]
        };
      case MetaformFieldType.Submit:
        return {
          title: "",
          name: "submit",
          type: fieldType,
          text: strings.draftEditorScreen.editor.fields.submit ?? fieldType,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ]
        };
      case MetaformFieldType.Html:
        return {
          name: name ?? fieldType,
          title: " ",
          required: required ?? false,
          type: fieldType,
          contexts: [ FormContext.FORM, FormContext.MANAGEMENT ]
        };
      default:
        return {
          name: name ?? fieldType,
          title: title ?? fieldType,
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
      title: title ?? "Section",
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
    const values = foundReply.data;
    foundMetaform.sections?.forEach(async foundSection => {
      const section = foundMetaform.sections && foundSection ? foundSection : undefined;
      if (section) {
        section.fields?.forEach(async foundField => {
          const field = section.fields && foundField ? foundField : undefined;
          if (field &&
                    field.type === MetaformFieldType.Files &&
                    values &&
                    field.name &&
                    values[field.name]) {
            const fileIds = Array.isArray(values[field.name]) ? values[field.name] : [values[field.name]];
            const attachmentPromises = (fileIds as string[]).map(fileId => {
              return attachmentsApi.findAttachment({ attachmentId: fileId, ownerKey: currentOwnerKey });
            });
              // eslint-disable-next-line no-await-in-loop
            const attachments = await Promise.all(attachmentPromises);
            values[field.name] = {
              files: attachments.map(a => {
                return {
                  name: a.name,
                  id: a.id,
                  persisted: true
                };
              })
            };
          }
        });
      }
    });
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

        if (field.type === MetaformFieldType.Files && !field.uploadUrl) {
          field.uploadUrl = Api.createDefaultUploadUrl();
        }

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
   * Gets the monthly average reply count
   *
   * @param replies replies
   * @returns monthly average reply
   */
  export const getMonthlyAverageReply = (replies: Reply[]): number => {
    const sortedReplyDates = (replies
      .map(reply => reply.createdAt)
      .filter(createdAt => createdAt !== undefined) as Date[])
      .sort();

    if (sortedReplyDates.length === 0) {
      return 0;
    }

    const monthCount = sortedReplyDates.filter((prev, index) => {
      if (index === sortedReplyDates.length - 1) {
        return;
      }
      const next: Date = sortedReplyDates[index + 1];
      return !moment(prev).isSame(next, "month") || !moment(prev).isSame(next, "year");
    }).length + 1;

    return sortedReplyDates.length / monthCount;
  };

  /**
   * Date comparator
   *
   * @param replyAuditLog1 reply audit log 1
   * @param replyAuditLog2 reply audit log 2
   * @returns integer indicates the result
   */
  const dateComparator = (replyAuditLog1: ReplyAuditLog, replyAuditLog2: ReplyAuditLog) =>
    (moment(replyAuditLog1.createdAt).isAfter(replyAuditLog2.createdAt) ? 1 : -1);

  /**
  * Reply id comparator
  *
  * @param replyAuditLog1 reply audit log 1
  * @param replyAuditLog2 reply audit log 2
  * @returns integer indicates the result
  */
  const replyIdComparator = (replyAuditLog1: ReplyAuditLog, replyAuditLog2: ReplyAuditLog) =>
    (replyAuditLog1.replyId.localeCompare(replyAuditLog2.replyId));

  /**
   * Gets the average reply view delay
   *
   * @param auditLogEntries audit log entries
   * @returns average reply delay
   */
  export const getAverageReplyViewDelay = (auditLogEntries: AuditLogEntry[]): moment.Duration => {
    const preprocessAuditLogEntries: ReplyAuditLog[] = auditLogEntries
      .filter(entry =>
        entry.replyId !== undefined &&
        entry.createdAt !== undefined &&
        entry.logEntryType !== undefined).map(entry => (
        {
          replyId: entry.replyId!,
          createdAt: entry.createdAt!,
          logEntryType: entry.logEntryType!
        }
      ));

    // js sort is stable
    preprocessAuditLogEntries.sort(dateComparator);
    preprocessAuditLogEntries.sort(replyIdComparator);

    let replyCount = 0;
    // time in millisecond
    let totalTime = 0;
    let createEntry: ReplyAuditLog;

    preprocessAuditLogEntries.forEach(entry => {
      if (entry.logEntryType === AuditLogEntryType.CreateReply) {
        createEntry = entry;
      } else if (
        entry.logEntryType === AuditLogEntryType.ViewReply &&
        createEntry !== undefined &&
        entry.replyId === createEntry.replyId
      ) {
        totalTime += entry.createdAt.getTime() - createEntry.createdAt.getTime();
        replyCount += 1;
      }
    });

    if (replyCount === 0) return moment.duration(0);

    return moment.duration(Math.floor(totalTime / replyCount));
  };

  /**
   * Create status section for new metaform
   * 
   * @returns status section for form
   */
  export const formStatusSection = (): MetaformField => {
    return {
      name: "status",
      type: MetaformFieldType.Radio,
      options: [
        {
          name: "waiting", text: ReplyStatus.WAITING, checked: true
        },
        { name: "processing", text: ReplyStatus.PROCESSING },
        { name: "done", text: ReplyStatus.DONE }
      ],
      contexts: [
        FormContext.MANAGEMENT_LIST
      ],
      flags: {
        managementEditable: true
      }
    };
  };

  /**
   * Filter out status from form
   * 
   * @param form Metaform form
   * @returns Metaform without status field
   */
  export const removeStatusFieldFromForm = (form: Metaform) => {
    const sectionsWithoutStatusField = form.sections?.map(section => {
      const hasStatusField = section?.fields?.filter(field => field.name !== "status");
      const newSection: MetaformSection = JSON.parse(JSON.stringify(section));
      newSection.fields = hasStatusField;
      return newSection;
    });
    const newForm: Metaform = JSON.parse(JSON.stringify(form));
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
  export const fieldRuleScan = (fieldRule: FieldRule, match: string, foundFieldRules: FieldRule[], fieldOptionMatch?: MetaformFieldOption) => {
    if (fieldRule.field === match) {
      if (fieldOptionMatch !== undefined) {
        if (fieldOptionMatch.name === fieldRule.equals || fieldOptionMatch.name === fieldRule.notEquals) {
          foundFieldRules.push(fieldRule);
        }
      } else {
        foundFieldRules.push(fieldRule);
      }
    }

    fieldRule.and?.forEach(rule => fieldRuleScan(rule, match, foundFieldRules, fieldOptionMatch));
    fieldRule.or?.forEach(rule => fieldRuleScan(rule, match, foundFieldRules, fieldOptionMatch));
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
}

export default MetaformUtils;