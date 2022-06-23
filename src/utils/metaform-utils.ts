import { Metaform, MetaformField, MetaformFieldType, MetaformSection } from "../generated/client";

/**
 * Utility class for metaform
 */
export default class MetaformUtils {

  /**
   * Create new Metaform
   * 
   * @returns new Metaform 
   */
  public static createNewMetaform = (newTitle: string, allowAnonymousRule: boolean): Metaform => {
    return {
      id: "new-metaform", // TODO: generate id
      title: newTitle,
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
      ]
    };
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