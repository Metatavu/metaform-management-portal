import Api from "api";
import { AttachmentsApi, Metaform, MetaformField, MetaformFieldSourceType, MetaformFieldType, MetaformSection, Reply } from "generated/client";
import Keycloak from "keycloak-js";
import { FieldValue } from "metaform-react/types";
import { Dictionary } from "types";

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
   * @returns created field
   */
  export const createEmptyField = (fieldType: MetaformFieldType): MetaformField => {
    if (fieldType === MetaformFieldType.Select || fieldType === MetaformFieldType.Radio) {
      return {
        title: fieldType,
        type: fieldType,
        options: [
          {
            name: "option",
            text: "option"
          }
        ]
      };
    }

    return {
      name: fieldType,
      title: fieldType,
      type: fieldType
    };
  };

  /**
   * Create an empty section
   *
   * @returns created section
   */
  export const createEmptySection = (): MetaformSection => {
    return {
      title: "Section",
      fields: []
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
  export const processReplyData = async (foundMetaform: Metaform, foundReply: Reply, currentOwnerKey: string, attachmentsApi: AttachmentsApi) => {
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
}

export default MetaformUtils;