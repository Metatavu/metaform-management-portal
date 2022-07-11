import { Metaform, MetaformField, MetaformFieldType, MetaformSection } from "generated/client";

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
      replyStrategy: undefined,
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

}

export default MetaformUtils;