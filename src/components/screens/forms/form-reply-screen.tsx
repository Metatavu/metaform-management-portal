import React, { FC, useContext, useEffect, useState } from "react";
import strings from "localization/strings";
import { Metaform, MetaformFieldType, Reply } from "generated/client";
import { FieldValue, FileFieldValue } from "metaform-react/types";
import MetaformUtils from "utils/metaform-utils";
import Form from "components/generic/form";
import { ErrorContext } from "components/contexts/error-handler";
import Api from "api";
import { useApiClient, useAppDispatch, useAppSelector } from "app/hooks";
import { selectKeycloak } from "features/auth-slice";
import { Dictionary, ReplyStatus } from "types";
import { useNavigate, useParams } from "react-router-dom";
import GenericLoaderWrapper from "components/generic/generic-loader";
import ReplySaved from "./form/ReplySaved";
import { Divider, MenuItem, Stack, TextField } from "@mui/material";
import LocalizationUtils from "utils/localization-utils";
import { FormReplyAction, FormReplyContent, ReplyViewContainer } from "styled/form/form-reply";
import { ArrowBack, SaveAlt, CheckCircle, NewReleases, Pending } from "@mui/icons-material";
import { RoundActionButton } from "styled/generic/form";
import { setSnackbarMessage } from "features/snackbar-slice";
import theme from "theme";

/**
 * Component for single reply screen
 */
const ReplyScreen: FC = () => {
  const errorContext = useContext(ErrorContext);
  const navigate = useNavigate();
  const params = useParams();
  const { formSlug, replyId } = params;

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, repliesApi, attachmentsApi } = apiClient;

  const dispatch = useAppDispatch();
  const keycloak = useAppSelector(selectKeycloak);

  const [ loading, setLoading ] = useState(false);
  const [ metaform, setMetaform ] = useState<Metaform>(MetaformUtils.jsonToMetaform({}));
  const [ formValues, setFormValues ] = useState<Dictionary<FieldValue>>({});
  const [ reply, setReply ] = useState<Reply>();
  const [ replySavedVisible, setReplySavedVisible ] = useState(false);

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
          const fileValue = getFieldValue(field.name as string) as FileFieldValue;
          if (fileValue && fileValue.files) {
            values[field.name as string] = fileValue.files.map(file => file.id);
          }
        }
      });
    });

    try {
      await repliesApi.updateReply({
        metaformId: metaform.id,
        reply: { ...reply, data: values as { [index: string]: object } },
        replyId: reply.id
      });

      const updatedReply = await repliesApi.findReply({
        metaformId: metaform.id,
        replyId: reply.id
      });
      const updatedValues = await MetaformUtils.processReplyData(metaform, updatedReply, attachmentsApi);
      
      dispatch(setSnackbarMessage(strings.successSnackbars.replies.replyEditSuccessText));
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
    if (!metaform.id || !replyId) {
      return;
    }

    setLoading(true);

    try {
      const pdf = await repliesApi.replyExport({
        metaformId: metaform.id,
        replyId: replyId,
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
        titleColor="#000"
        contexts={ ["MANAGEMENT"] }
        metaform={ metaform }
        getFieldValue={ getFieldValue }
        setFieldValue={ setFieldValue }
        onSubmit={ onSave }
        isReply
      />
    );
  };

  /**
   * Handle selected reply status change
   *
   * @param event event
   */
  const handleReplyStatusChange = async (event: React.ChangeEvent<{ value: string }>) => {
    if (!reply?.data || !reply.id) {
      return;
    }

    const values = { ...formValues };
    values.status = event.target.value;

    setReply({ ...reply, data: values as { [index: string]: object } });
    setFormValues(values);
  };

  /**
   * Renders reply status icon
   * 
   * @param replyStatus replyStatus
   */
  const renderReplyStatusIcon = (replyStatus: ReplyStatus) => {
    switch (replyStatus) {
      case ReplyStatus.WAITING:
        return <NewReleases sx={{ color: theme.palette.error.light, mr: 1 }}/>;
      case ReplyStatus.PROCESSING:
        return <Pending sx={{ color: theme.palette.warning.light, mr: 1 }}/>;
      case ReplyStatus.DONE:
        return <CheckCircle sx={{ color: theme.palette.success.light, mr: 1 }}/>;
      default:
        break;
    }
  };

  /**
   * Renter status switch
   */
  const renderStatusSelect = () => (
    <GenericLoaderWrapper style={{ width: 300 }} loading={ loading }>
      <TextField
        select
        sx={{ width: 300 }}
        key="metaform-select-container"
        value={ reply?.data?.status }
        onChange={ handleReplyStatusChange }
      >
        {
          Object.values(ReplyStatus).map(status =>
            <MenuItem
              key={ `metaform-reply-status-${status}` }
              value={ status }
            >
              <Stack direction="row">
                { renderReplyStatusIcon(status) }
                { LocalizationUtils.getLocalizedStatusOfReply(status) }
              </Stack>
            </MenuItem>)
        }
      </TextField>
    </GenericLoaderWrapper>
  );

  return (
    <ReplyViewContainer>
      <FormReplyAction>
        <RoundActionButton
          startIcon={ <ArrowBack/> }
          color="error"
          variant="outlined"
          onClick={ () => navigate("./..") }
        >
          { strings.generic.back }
        </RoundActionButton>
        <Stack
          alignItems="center"
          direction="row"
          spacing={ 4 }
        >
          { renderStatusSelect() }
          <RoundActionButton
            startIcon={ <SaveAlt/> }
            color="primary"
            variant="outlined"
            onClick={ onExportPdfClick }
          >
            { strings.replyScreen.exportPdf }
          </RoundActionButton>
        </Stack>
      </FormReplyAction>
      <Divider/>
      <FormReplyContent>
        <GenericLoaderWrapper loading={ loading }>
          <>
            { renderForm() }
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