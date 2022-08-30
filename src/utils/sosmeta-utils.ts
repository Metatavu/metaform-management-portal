import Config from "app/config";
import { Metaform, MetaformFieldType } from "generated/client";
import MetaformUtils from "./metaform-utils";

enum SosmetaType {
  ARRAY = "array",
  BOOLEAN = "boolean",
  INTEGER = "integer",
  NULL = "null",
  NUMBER = "number",
  OBJECT = "object",
  STRING = "string"
}

/**
 * Namespace for Sosmeta utilities
 */
namespace SosmetaUtils {

  const sosmetaUrlSuffix = "/schema";

  const metaform: Metaform = {

  };

  /**
   * Extracts needed properties from SosmetaSchema
   * 
   * @param sectionName sectionName
   * @param field field
   * @param required required
   * @returns MetaformField
   */
  const handleSosmetaStringField = (sectionName: string, field: any, required?: boolean) => {
    try {
      const fieldData = field.sosmeta;
      
      return MetaformUtils.createField(
        MetaformFieldType.Text,
        fieldData.name[0].value,
        `${sectionName.toLowerCase()}.${fieldData.name[0].value.toLowerCase()}`,
        required ?? fieldData.required
      );
    } catch (e) {
      // TODO: Error handling/messages
    }
  };

  /**
   * Extracts needed properties from SosmetaSchema
   * 
   * @param sectionName sectionName
   * @param field field
   * @returns MetaformField
   */
  const handleSosmetaBooleanField = (sectionName: string, field: any) => {
    const fieldData = field.sosmeta;

    return MetaformUtils.createField(
      MetaformFieldType.Boolean,
      fieldData.name[0].value,
      `${sectionName.toLowerCase()}.${fieldData.name[0].value.toLowerCase()}`,
      fieldData.required
    );
  };

  /**
   * Extracts needed properties from SosmetaSchema
   * 
   * @param sectionName
   * @param field field
   * @param required required
   * @returns MetaformField
   */
  const handleSosmetaObjectField = (sectionName: string, field: any, required: boolean) => {
    try {
      switch (field.type) {
        case SosmetaType.STRING:
          return handleSosmetaStringField(
            sectionName,
            field,
            required
          );
        case SosmetaType.OBJECT:
          return Object.keys(field.properties).map(x =>
            handleSosmetaStringField(
              sectionName,
              field.properties[x]
            ));
        case SosmetaType.BOOLEAN:
          return handleSosmetaBooleanField(
            sectionName,
            field
          );
        default:
          break;
      }
    } catch (e) {
      // TODO: Error handling/messages
    }
  };

  /**
   * Extracts needed properties from SosmetaSchema
   * 
   * @param sosmetaSection 
   * @returns 
   */
  const handleSosmetaArraySection = (sosmetaSection: any) => {
    try {
      const requiredFieldNames: string[] = sosmetaSection.items.required;
      const fields = Object.keys(sosmetaSection.items.properties).map(fieldName => sosmetaSection.items.properties[fieldName]);
      
      return fields.map(field =>
        handleSosmetaStringField(
          sosmetaSection.items.sosmeta.name[0].value,
          field,
          requiredFieldNames.includes(field.sosmeta.name[0].value.toLowerCase())
        ));
    } catch (e) {
      // TODO: Error handling/messages
    }
  };

  /**
   * Extracts needed properties from SosmetaSchema
   * 
   * @param sosmetaSection 
   * @returns 
   */
  const handleSosmetaObjectSection = (sosmetaSection: any) => {
    try {
      const requiredFieldNames: string[] = sosmetaSection.required;
      const fields = Object.keys(sosmetaSection.properties).map(fieldName => sosmetaSection.properties[fieldName]);
      // console.log(fields)
      return fields.map(field =>
        handleSosmetaObjectField(
          sosmetaSection.sosmeta.name[0].value,
          field,
          requiredFieldNames.includes(field.sosmeta.name[0].value.toLowerCase())
        ));
    } catch (e) {
      // TODO: Error handling/messages
    }
  };

  /**
   * Extracts needed properties from SosmetaSchema
   * 
   * @param sosmetaSection 
   * @returns 
   */
  const handleSosmetaStringSection = (sosmetaSection: any) => {
    try {
      const { required } = sosmetaSection;

      return [ handleSosmetaStringField(sosmetaSection.sosmeta.name[0].value, sosmetaSection, required) ];
    } catch (e) {
      // TODO: Error handling/messages
    }
  };

  /**
   * Converts SosmetaSchema properties to equivalent Metaform Sections
   * 
   * @param sosmetaForm
   * @returns MetaformSection[]
   */
  const convertSections = (sosmetaForm: any) => {
    const sosmetaSections = Object.keys(sosmetaForm.properties).map(sosmetaSection => sosmetaForm.properties[sosmetaSection]);
    return sosmetaSections.map(sosmetaSection => {
      switch (sosmetaSection.type) {
        case SosmetaType.ARRAY:
          return MetaformUtils.createSection(
            sosmetaSection.items.sosmeta.name[0].value,
            handleSosmetaArraySection(sosmetaSection)
          );
        case SosmetaType.BOOLEAN:
          return MetaformUtils.createSection();
        case SosmetaType.INTEGER:
          return MetaformUtils.createSection();
        case SosmetaType.NULL:
          return MetaformUtils.createSection();
        case SosmetaType.NUMBER:
          return MetaformUtils.createSection();
        case SosmetaType.OBJECT:
          return MetaformUtils.createSection(
            sosmetaSection.sosmeta.name[0].value,
            handleSosmetaObjectSection(sosmetaSection)?.flat()
          );
        case SosmetaType.STRING:
          return MetaformUtils.createSection(
            sosmetaSection.sosmeta.name[0].value,
            handleSosmetaStringSection(sosmetaSection)
          );
        default:
          return MetaformUtils.createSection();
      }
    });
  };

  /**
   * Validates converted form fields e.g. filters undefined values out
   * 
   * @returns Metaform
   */
  const validateConvertedField = (): Metaform => {
    return {
      ...metaform,
      sections: metaform.sections?.map(section => ({
        title: section.title,
        fields: section.fields?.filter(field => field !== undefined)
      }))
    };
  };
    
  /**
   * Fetches Sosmeta schema from Sosmeta
   * 
   * @param sosmetaUrl of sosmeta schema
   * @return Sosmeta Schema as JSON
   */
  const fetchSosmetaSchema = async (sosmetaUrl: string) => {
    try {
      const schemaUrl = sosmetaUrl?.replace("/definition", sosmetaUrlSuffix);
      const corsProxy = Config.getCorsProxy();
      const request = await fetch(`${corsProxy}/${schemaUrl}`);
      
      if (request.status === 200) {
        return await request.json();
      }
    } catch (e) {
      throw new Error("Error happened while fetching Sosmeta Schema");
    }
  };

  /* eslint-disable prefer-destructuring */
  /**
   * Converts Sosmeta Schema into Metaform
   * 
   * @param sosmetaUrl string
   * @return Metaform
   */
  export const convertSosmetaToMetaform = async (sosmetaUrl: string) => {
    try {
      const schema: any = await fetchSosmetaSchema(sosmetaUrl);
      metaform.title = schema.title.split("'")[1];
      const sosmetaFormPropertyName = Object.keys(schema.properties)[0];
      const sosmetaForm = schema.properties[sosmetaFormPropertyName];
      metaform.sections = convertSections(sosmetaForm);
      return validateConvertedField();
    } catch (e) {
      // TODO: Error handling/messages
    }
  };
}

export default SosmetaUtils;