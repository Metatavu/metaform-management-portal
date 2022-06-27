import { Metaform, MetaformField, MetaformFieldType, MetaformSection } from "../generated/client";

/**
 * Utility class for metaform
 */
export default class MetaformUtils {

  /**
   * Create new Metaform
   * 
   * @param formTitle Title of the metaform
   * @param allowAnonymousRule boolean to allow anonymous users to access the metaform
   * @returns new Metaform 
   */
  public static createNewMetaform = (formTitle: string, allowAnonymousRule: boolean): Metaform => {
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
      visibleIf: undefined,
      permissionContexts: undefined,
      name: fieldType,
      type: fieldType,
      title: fieldType,
      required: false,
      contexts: [],
      flags: undefined,
      placeholder: undefined,
      _class: undefined,
      readonly: undefined,
      help: undefined,
      _default: undefined,
      min: undefined,
      max: undefined,
      step: undefined,
      checked: undefined,
      printable: undefined,
      options: [],
      autocomplete: undefined,
      sourceUrl: undefined,
      singleFile: undefined,
      onlyImages: undefined,
      maxFileSize: undefined,
      addRows: undefined,
      draggable: undefined,
      columns: [],
      src: undefined,
      text: undefined,
      html: undefined,
      source: undefined
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