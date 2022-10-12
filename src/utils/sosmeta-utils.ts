import Config from "app/config";
import { Metaform, MetaformFieldType } from "generated/client";
import MetaformUtils from "./metaform-utils";
import { SosmetaType } from "../types/index";

// TODO: Typing for Sosmeta Schemas and support for other possible field types(?)
/**
 * Namespace for Sosmeta utilities
 */
namespace SosmetaUtils {

  const sosmetaUrlSuffix = "/schema";

  const metaform: Metaform = {};

  /**
   * Handles creation of MetaformField with MetaformFieldType of text
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
   * Handles creation of MetaformField with MetaformFieldType of boolean
   *
   * @param sectionName sectionName
   * @param field field
   * @returns MetaformField
   */
  const handleSosmetaBooleanField = (sectionName: string, field: any, required?: boolean) => {
    try {
      const fieldData = field.sosmeta;

      return MetaformUtils.createField(
        MetaformFieldType.Boolean,
        fieldData.name[0].value,
        `${sectionName.toLowerCase()}.${fieldData.name[0].value.toLowerCase()}`,
        required ?? fieldData.required
      );
    } catch (e) {
      // TODO: Error handling/messages
    }
  };

  /**
   * Handles creation of MetaformField with MetaformFieldType of object
   *
   * @param sectionName
   * @param field field
   * @param required required
   * @returns MetaformField[]
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
          // eslint-disable-next-line no-case-declarations
          const firstKey = Object.keys(field.properties)[0];
          if (field.properties[firstKey].sosmeta) {
            return Object.keys(field.properties).map(x =>
              handleSosmetaStringField(
                sectionName,
                field.properties[x]
              ));
          }
          return handleSosmetaStringField(
            sectionName,
            field
          );
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
   * Handles creation of MetaformFields from Sosmeta Schema Properties of type array
   * TODO: This may need restructuring when being tested with more Sosmeta schemas
   *
   * @param sosmetaSection
   * @returns MetaformField[]
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
   * Handles creation of MetaformFields from Sosmeta Schema Properties of type object
   * Type object contains sub properties which contain the data that can be
   * converted to MetaformField and therefore each object key needs to be mapped
   *
   * @param sosmetaSection
   * @returns MetaformField[]
   */
  const handleSosmetaObjectSection = (sosmetaSection: any) => {
    try {
      const requiredFieldNames: string[] = sosmetaSection.required;
      const fields = Object.keys(sosmetaSection.properties).map(fieldName => sosmetaSection.properties[fieldName]);

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
   * Handles creation of MetaformFields from Sosmeta Schema Properties of type string
   *
   * @param sosmetaSection
   * @returns MetaformField
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
   * Handles creation of MetaformFields from Sosmeta Schema Properties of type boolean
   *
   * @param sosmetaSection
   * @returns MetaformField
   */
  const handleSosmetaBooleanSection = (sosmetaSection: any) => {
    try {
      const { required } = sosmetaSection;

      return [ handleSosmetaBooleanField(sosmetaSection.sosmeta.name[0].value, sosmetaSection, required) ];
    } catch (e) {
      // TODO: Error handling/messagess
    }
  };

  /**
   * Maps through Sosmeta Schema Properties
   * and creates Metaform Section from each property
   * based on type (SosmetaType) of given property
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
          return MetaformUtils.createSection(
            sosmetaSection.sosmeta.name[0].value,
            handleSosmetaBooleanSection(sosmetaSection)
          );
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
        const responseBuffer = await request.arrayBuffer();
        const decoder = new TextDecoder("iso-8859-1");
        const decodedResponse = decoder.decode(responseBuffer);
        return JSON.parse(decodedResponse);
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
      metaform.sections = convertSections(sosmetaForm).filter(section => section.fields && section.fields.length);
      return validateConvertedField();
    } catch (e) {
      throw new Error(`Error happened while converting Sosmeta Schema: ${e}`);
    }
  };
}

export default SosmetaUtils;