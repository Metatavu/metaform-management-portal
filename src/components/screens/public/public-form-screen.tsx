import { Dictionary } from "@reduxjs/toolkit";
import Api from "api";
import Config from "app/config";
import { ErrorContext } from "components/contexts/error-handler";
import Form from "components/generic/form";
import { Metaform, MetaformFieldSourceType, MetaformFieldType, Reply } from "generated/client";
import strings from "localization/strings";
import { FieldValue } from "metaform-react/types";
import React from "react";
import FormEditorUtils from "utils/form-editor-utils";
import FormUtils from "utils/form-utils";

/**
 * Component props
 */
interface Props {
  metaform: Metaform;
}

/**
 * Public forms screen component
 */
const PublicFormScreen: React.FC = (props) => {
  const errorContext = React.useContext(ErrorContext);

  const [ draftId, setDraftId ] = React.useState<string | null>(null);
  const [ draftSaveVisible, setDraftSaveVisible ] = React.useState<boolean>(false);
  const [ formValues, setFormValues ] = React.useState<Dictionary<FieldValue>>({});
  const [ metaform, setMetaform ] = React.useState<Metaform>(FormEditorUtils.jsonToMetaform({}));
  const [ ownerKey, setOwnerKey ] = React.useState<string | undefined>(undefined);
  const [ redirectTo, setRedirectTo ] = React.useState<string>();

  /**
   * Prepares form values for the form. 
   *
   * @param metaform metaform
   * @returns prepared form values
   */
  const prepareFormValues = (metaformData: Metaform): Dictionary<FieldValue> => {
    const result = { ...formValues };

    metaformData.sections?.forEach(section => {
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
            const selectedOption = options.find(option => option.selected || option.checked);
            if (selectedOption) {
              result[name] = selectedOption.name;
            }
          }

          if (accessToken) {
            const { tokenParsed } = accessToken;

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
   * Finds the reply from API
   * 
   * @param replyId reply id
   * @param ownerKey owner key
   * @returns found reply or null if not found
   */
  const findReply = async (replyId: string, ownerKey: string) => {
    if (!accessToken) {
      return null;
    }

    try {
      const metaformId = Config.getMetaformId();

      const replyApi = Api.getRepliesApi(accessToken);
      return await replyApi.findReply({
        metaformId: metaformId,
        replyId: replyId,
        ownerKey: ownerKey
      });
    } catch (e) {
      return null;
    }
  };

  /**
   * Method for getting field value
   *
   * @param fieldName field name
   */
  const getFieldValue = (fieldName: string): FieldValue => {
    return formValues[fieldName];
  };

  /**
   * Initializes the form
   */
  const initializeForm = async () => {
    if (!accessToken) {
      return;
    }

    const query = new URLSearchParams(location.search);

    const initialDraftId = query.get("draft");
    const initialReplyId = query.get("reply");
    const initialOwnerKey = query.get("owner-key");

    const metaformId = Config.getMetaformId();

    try {
      setLoading(true);
      setDraftId(initialDraftId);

      const metaformsApi = Api.getMetaformsApi(accessToken);

      const metaformJson = await metaformsApi.findMetaform({
        metaformId: metaformId,
        replyId: initialReplyId || undefined,
        ownerKey: ownerKey || undefined
      });
      
      document.title = metaformJson.title ? metaformJson.title : "Metaform";

      const initialFormValues = prepareFormValues(metaformJson);

      if (initialReplyId && initialOwnerKey) {
        const reply = await findReply(initialReplyId, initialOwnerKey);
        if (reply) {
          const replyData = await processReplyData(metaformJson, reply, initialOwnerKey);
          if (replyData) {
            Object.keys(replyData as any).forEach(replyKey => {
              initialFormValues[replyKey] = replyData[replyKey] as any;
            });
          }

          setReply(reply);
          setOwnerKey(ownerKey);
          setReplyDeleteVisible(!!initialOwnerKey);
        } else {
          errorContext.setError(strings.errorHandling.form.replyNotFound);
        }
      } else if (initialDraftId) {
        const draft = await findDraft(initialDraftId);
        const draftData = draft?.data || {};
        Object.keys(draftData).forEach(draftKey => {
          initialFormValues[draftKey] = draftData[draftKey] as any;
        });
      }

      setMetaform(metaformJson);
      setFormValues(initialFormValues);
      setLoading(false);
    } catch (error) {
      if (error instanceof Response && error.status === 403 && !signedToken) {
        setRedirectTo("/protected/form");
      } else {
        setLoading(false);
        console.log(error);
      }
    }
  };

  /**
   * Effect that initializes the form
   */
  React.useEffect(() => {
    initializeForm();
  }, []);

  return (
    <Form
      accessToken={ accessToken }
      ownerKey={ ownerKey || "" }
      contexts={ ["FORM"] }
      metaform={ metaform }
      getFieldValue={ this.getFieldValue }
      setFieldValue={ this.setFieldValue }
      onSubmit={ this.onSubmit }
      onValidationErrorsChange={ this.onValidationErrorsChange }
      accessTokenNotValid={ accessTokenNotValid }
    />
  );
};

export default PublicFormScreen;