import Api from "api";
import { AttachmentsApi, AuditLogEntry, AuditLogEntryType, Metaform, MetaformField, MetaformFieldSourceType, MetaformFieldType, MetaformSection, Reply } from "generated/client";
import { FieldValue } from "metaform-react/types";
import { Dictionary, ReplyAuditLog } from "types";
import strings from "localization/strings";
import moment from "moment";

/**
 * Utility class for metaform
 */
namespace MetaformUtils {

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
    if (fieldType === MetaformFieldType.Select ||
        fieldType === MetaformFieldType.Radio ||
        fieldType === MetaformFieldType.Checklist) {
      return {
        name: name ?? fieldType,
        title: title ?? fieldType,
        type: fieldType,
        required: required ?? false,
        options: options ?? [
          {
            name: "option",
            text: "option1"
          }
        ]
      };
    }
    if (fieldType === MetaformFieldType.Boolean) {
      return {
        name: name ?? fieldType,
        title: title ?? fieldType,
        type: fieldType,
        required: required ?? false,
        checked: false
      };
    }

    if (fieldType === MetaformFieldType.Slider) {
      return {
        name: name ?? fieldType,
        title: title ?? fieldType,
        type: fieldType,
        required: required ?? false,
        min: 50,
        max: 100
      };
    }

    if (fieldType === MetaformFieldType.Table) {
      return {
        name: name ?? fieldType,
        title: title ?? fieldType,
        text: fieldType,
        type: fieldType,
        required: required ?? false,
        columns: options ?? [
          {
            type: "text",
            name: "column1",
            title: "Column 1"
          },
          {
            type: "number",
            name: "column2",
            title: "Column 2"
          },
          {
            type: "number",
            name: "column3",
            title: "Column 3"
          }
        ]
      };
    }
    if (fieldType === MetaformFieldType.Submit) {
      return {
        title: "",
        name: "submit",
        type: fieldType,
        text: strings.draftEditorScreen.editor.fields.submit ?? fieldType,
        columns: [],
        contexts: options ?? ["FORM"]
      };
    }
    if (fieldType === MetaformFieldType.Html) {
      return {
        name: name ?? fieldType,
        title: "",
        required: required ?? false,
        type: fieldType
      };
    }
    return {
      name: name ?? fieldType,
      title: title ?? fieldType,
      required: required ?? false,
      text: fieldType,
      type: fieldType
    };
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
    (moment(replyAuditLog1.createdAt).isAfter(replyAuditLog2.createdAt) ? 1 : 0);

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
    const dateSortedAuditLogs = preprocessAuditLogEntries
      .sort(dateComparator);

    const replyIdSortedAuditLogs = preprocessAuditLogEntries
      .sort(replyIdComparator);

    let replyCount = 0;
    // time in millisecond
    let totalTime = 0;
    let createEntry: ReplyAuditLog;

    replyIdSortedAuditLogs.forEach(entry => {
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
}

export default MetaformUtils;