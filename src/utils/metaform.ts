import { Metaform, MetaformField, MetaformFieldType, MetaformSection } from "generated/client";

/**
 * Utility class for metaform
 */
export default class MetaformUtils {

  /**
   * Convert metaform to json format
   *
   * @param metaform metaform data
   * @returns metaform in json format
   */
  public static metaformToJson = (metaform: Metaform): string => {
    return metaform ? JSON.stringify(metaform, null, 2) : "";
  };

  /**
   * Convert Object to metaform data
   *
   * @param metaformJson metaform data in json
   * @returns metaform data
   */
  public static ObjectToMetaform = (metaformJson: Object): Metaform => {
    return {
      ...JSON.parse(JSON.stringify(metaformJson))
    } as Metaform;
  };

  /**
   * Convert json to metaform data
   *
   * @param metaformJson metaform data in json
   * @returns metaform data
   */
  public static jsonToMetaform = (metaformJson: string): Metaform => {
    return {
      ...JSON.parse(metaformJson)
    } as Metaform;
  };

  /**
   * Create empty field for given field type
   *
   * @param fieldType metaform field type
   * @returns created field
   */
  public static createEmptyField = (fieldType: MetaformFieldType): MetaformField => {
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
  public static createEmptySection = (): MetaformSection => {
    return {
      title: "Section",
      fields: []
    };
  };

}