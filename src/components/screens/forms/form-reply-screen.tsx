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
import { Dictionary, NOT_SELECTED, ReplyStatus } from "types";
import { useNavigate, useParams } from "react-router-dom";
import GenericLoaderWrapper from "components/generic/generic-loader";
import ReplySaved from "./form/ReplySaved";
import { Divider, MenuItem, Stack, TextField } from "@mui/material";
import LocalizationUtils from "utils/localization-utils";
import { FormReplyAction, FormReplyActionButton, FormReplyContent, ReplyViewContainer } from "styled/form/form-reply";
import { ArrowBack, SaveAlt } from "@mui/icons-material";

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
  const navigate = useNavigate();

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

      MetaformUtils.downloadBlob(pdf, `${formSlug}-${replyId}.pdf`);
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

  /**
   * Renter status switch
   */
  const renderStatusSelect = () => (
    <TextField
      select
      sx={{ width: 300 }}
      key="metaform-select-container"
      value={ reply?.data?.status || NOT_SELECTED }
      onChange={ handleReplyStatusChange }
    >
      <MenuItem value={ NOT_SELECTED } key="no-status-selected">{ strings.replyScreen.selectStatus }</MenuItem>
      {
        Object.values(ReplyStatus).map(status =>
          <MenuItem
            key={ `metaform-reply-status-${status}` }
            value={ status }
          >
            { LocalizationUtils.getLocalizedStatusOfReply(status) }
          </MenuItem>)
      }
    </TextField>
  );

  return (
    <ReplyViewContainer>
      <FormReplyAction>
        {/* Button styling */}
        <FormReplyActionButton
          startIcon={ <ArrowBack/> }
          color="error"
          variant="outlined"
          onClick={ () => navigate("./..") }
        >
          { strings.generic.back }
        </FormReplyActionButton>
        <Stack
          alignItems="center"
          direction="row"
          spacing={ 4 }
        >
          { renderStatusSelect() }
          <FormReplyActionButton
            startIcon={ <SaveAlt/> }
            color="primary"
            variant="outlined"
            onClick={ onExportPdfClick }
          >
            { strings.replyScreen.exportPdf }
          </FormReplyActionButton>
        </Stack>
      </FormReplyAction>
      <Divider/>
      <FormReplyContent>
        <GenericLoaderWrapper loading={ loading }>
          <>
            { renderForm() }
            {/* TODO fix styling (title, replacing plain html to mui) */}
            <ReplySaved
              replySavedVisible={ replySavedVisible }
              setReplySavedVisible={ setReplySavedVisible }
            />
          </>
        </GenericLoaderWrapper>
      </FormReplyContent>
    </ReplyViewContainer>
  );
};

export default ReplyScreen;