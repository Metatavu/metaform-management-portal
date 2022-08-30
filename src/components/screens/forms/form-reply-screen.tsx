import React, { FC, useContext, useEffect, useState } from "react";
import strings from "localization/strings";
import { Metaform, MetaformFieldType, Reply } from "generated/client";
import { FieldValue, FileFieldValue } from "metaform-react/types";
import MetaformUtils from "utils/metaform-utils";
import Form from "components/generic/form";
import { ErrorContext } from "components/contexts/error-handler";
import Api from "api";
import { useApiClient, useAppSelector } from "app/hooks";
import { selectKeycloak } from "features/auth-slice";
import { Dictionary, ReplyStatus } from "types";
import { useParams } from "react-router-dom";
import GenericLoaderWrapper from "components/generic/generic-loader";
import ReplySaved from "./form/ReplySaved";
import { Button, Stack } from "@mui/material";
import FormContainer from "styled/generic/form";
import { StatusSelector } from "styled/layouts/admin-layout";

/**
 * Component for single reply screen
 */
const ReplyScreen: FC = () => {
  const errorContext = useContext(ErrorContext);

  const [ loading, setLoading ] = useState(false);
  const [ metaform, setMetaform ] = useState<Metaform>(MetaformUtils.jsonToMetaform({}));
  const [ formValues, setFormValues ] = useState<Dictionary<FieldValue>>({});
  const [ reply, setReply ] = useState<Reply>();
  const [ replySavedVisible, setReplySavedVisible ] = useState(false);

  const params = useParams();
  const { formSlug, replyId } = params;

  const apiClient = useApiClient(Api.getApiClient);
  const keycloak = useAppSelector(selectKeycloak);
  const { metaformsApi, repliesApi, attachmentsApi } = apiClient;

  if (!formSlug) {
    errorContext.setError(strings.errorHandling.adminRepliesScreen.formSlugNotFound);
  }

  if (!replyId) {
    errorContext.setError(strings.errorHandling.adminReplyScreen.replyIdNotFound);
  }

  /**
   * Load data for reply
   */
  const loadData = async () => {
    setLoading(true);

    try {
      const foundMetaform = await metaformsApi.findMetaform({
        metaformSlug: formSlug!
      });

      const replyData = await repliesApi.findReply({
        metaformId: foundMetaform.id!,
        replyId: replyId!
      });

      const processedReplyData = await MetaformUtils.processReplyData(foundMetaform, replyData, attachmentsApi) as any;
      const preparedFormValues = MetaformUtils.prepareFormValues(foundMetaform, processedReplyData, keycloak);

      if (preparedFormValues && foundMetaform && replyData) {
        setFormValues(preparedFormValues);
        setMetaform(foundMetaform);
        setReply(replyData);
      }
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminReplyScreen.fetchReply, e);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Method for getting field value
   *
   * @param fieldName field name
   */
  const getFieldValue = (fieldName: string): FieldValue => formValues[fieldName] || null;

  /**
   * Method for saving reply
   */
  const onSave = async () => {
    if (!metaform?.id || !reply?.id) {
      return;
    }

    setLoading(true);

    const values = { ...formValues };

    metaform.sections?.forEach(section => {
      section.fields?.forEach(field => {
        if (field.type === MetaformFieldType.Files) {
          let value = getFieldValue(field.name as string);
          if (!value) {
            value = { files: [] };
          }
          values[field.name as string] = (value as FileFieldValue).files.map(file => file.id);
        }
      });
    });

    try {
      await repliesApi.updateReply({
        metaformId: metaform.id!,
        reply: { ...reply, data: values as any },
        replyId: reply.id
      });

      const updatedReply = await repliesApi.findReply({
        metaformId: metaform.id!,
        replyId: reply.id
      });
      const updatedValues = await MetaformUtils.processReplyData(metaform, updatedReply, attachmentsApi);
      setReply(updatedReply);
      setFormValues(updatedValues as any);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminReplyScreen.saveReply, e);
    }

    setLoading(false);
  };

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
   * Event handler for PDF export button click
   */
  const onExportPdfClick = async () => {
    if (!metaform.id) {
      return;
    }

    setLoading(true);

    try {
      const pdf = await repliesApi.replyExport({
        metaformId: metaform.id!,
        replyId: replyId!,
        format: "PDF"
      });
  
      MetaformUtils.downloadBlob(pdf, "reply.pdf");
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminReplyScreen.exportPdf, e);
    }

    setLoading(false);
  };

  /**
   * Renders the form
   */
  const renderForm = () => {
    if (!metaform) {
      return null;
    }

    return (
      <Form
        contexts={ ["MANAGEMENT"] }
        metaform={ metaform }
        getFieldValue={ getFieldValue }
        setFieldValue={ setFieldValue }
        onSubmit={ onSave }
      />
    );
  };

  /**
   * Handle selected reply status change
   * 
   * @param event event
   */
  const handleReplyStatusChange = (event: React.ChangeEvent<{ value: string }>) => {
    if (!reply || !event) {
      return;
    }

    const updatedReplyData = { ...reply.data, status: event.target.value };
    const updatedReply = { ...reply, data: updatedReplyData as any };
    setReply(updatedReply);
  };

  const statusOptions = Object.keys(ReplyStatus).map(status => { return status; });
  // TODO: add localization for status options
  /**
   * Renter status switch
   */
  const renderStatusSwitch = () => {
    return (
      <StatusSelector
        key="metaform-select-container"
        value={ reply?.data?.status }
        onChange={ handleReplyStatusChange }
        disableUnderline
      >
        <option value="" key="no-status-selected">{ strings.replyScreen.selectStatus }</option>
        {
          statusOptions.map(status => {
            return (
              <option
                key={ `metaform-reply-status-${status}` }
                value={ status }
              >
                { status }
              </option>
            );
          })
        }
      </StatusSelector>
    );
  };

  return (
    <GenericLoaderWrapper loading={ loading }>
      <FormContainer>
        <Stack>
          <Stack direction="row" position="sticky">
            <Stack sx={{
              width: 100,
              margin: 1
            }}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={ onExportPdfClick }
              >
                { strings.replyScreen.exportPdf }
              </Button>
            </Stack>
            <Stack sx={{
              width: 50,
              margin: 1
            }}
            >
              { renderStatusSwitch() }
            </Stack>
          </Stack>
          <Stack>
            { renderForm() }
          </Stack>
        </Stack>
        <ReplySaved
          replySavedVisible={ replySavedVisible }
          setReplySavedVisible={ setReplySavedVisible }
        />
      </FormContainer>
    </GenericLoaderWrapper>
  );
};

export default ReplyScreen;