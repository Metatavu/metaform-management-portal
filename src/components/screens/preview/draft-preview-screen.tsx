import { Metaform } from "generated/client";
import React, { useContext, useState } from "react";
import strings from "localization/strings";
import { FieldValue } from "metaform-react/types";
import DraftPreviewHeader from "../../preview/draft-preview-header";
import DraftPreviewShareDialog from "../../preview/draft-preview-dialog";
import { useParams } from "react-router-dom";
import { ErrorContext } from "components/contexts/error-handler";
import Api from "api";
import { useApiClient } from "app/hooks";
import MetaformUtils from "utils/metaform-utils";
import GenericLoaderWrapper from "components/generic/generic-loader";
import Form from "components/generic/form";
import { Dictionary } from "@reduxjs/toolkit";

/**
 * Metaform editor preview component
 */
const DraftPreviewScreen: React.FC = () => {
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ draftForm, setDraftForm ] = useState<Metaform>(MetaformUtils.jsonToMetaform({}));
  const [ formValues, setFormValues ] = useState<Dictionary<FieldValue>>({});

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, versionsApi } = apiClient;
  const { formSlug, draftId } = useParams();
  const errorContext = useContext(ErrorContext);

  const linkToShare = `${window.location.origin}/${formSlug}`;

  /**
   * Loads MetaformVersion to edit.
   */
  const loadMetaformVersion = async () => {
    setLoading(true);

    try {
      const form = await metaformsApi.findMetaform({ metaformSlug: formSlug });
      const draft = await versionsApi.findMetaformVersion({
        metaformId: form.id!,
        versionId: draftId!
      });

      const parsedDraft = draft.data as Metaform;
      setDraftForm(parsedDraft);
      // setFormValues(MetaformUtils.prepareFormValues(parsedDraft, formValues!, undefined));
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.findDraft, e);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    loadMetaformVersion();
  }, []);

  /**
   * Method for getting field value
   *
   * @param fieldName field name
   */
  const getFieldValue = (fieldName: string): FieldValue => formValues[fieldName] || null;

  /**
   * Method for setting field value
   *
   * @param fieldName field name
   * @param fieldValue field value
   */
  const setFieldValue = (fieldName: string, fieldValue: FieldValue) => {
    if (formValues[fieldName] !== fieldValue) {
      setFormValues({ ...formValues, [fieldName]: fieldValue });
    }
  };

  /**
   * On share link click
   */
  const onShareLinkClick = () => {
    setDialogOpen(true);
  };

  /**
   * Renders share link dialog
   */
  const renderShareLinkDialog = () => (
    <DraftPreviewShareDialog
      open={ dialogOpen }
      onCancel={ () => setDialogOpen(false) }
      linkToShare={ linkToShare }
    />
  );

  return (
    <GenericLoaderWrapper loading={ loading }>
      <>
        <DraftPreviewHeader onShareLinkClick={ onShareLinkClick }/>
        <Form
          titleColor="#000"
          contexts={ ["FORM"] }
          metaform={ draftForm }
          getFieldValue={ getFieldValue }
          setFieldValue={ setFieldValue }
          onSubmit={ () => {} }
          saving={ false }
        />
        { renderShareLinkDialog() }
      </>
    </GenericLoaderWrapper>
  );
};

export default DraftPreviewScreen;