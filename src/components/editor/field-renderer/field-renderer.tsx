import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TextField, Typography } from "@mui/material";
import { MetaformField, MetaformFieldType } from "generated/client";
import strings from "localization/strings";
import MetaformBooleanFieldComponent from "metaform-react/MetaformBooleanFieldComponent";
import MetaformChecklistFieldComponent from "metaform-react/MetaformChecklistFieldComponent";
import MetaformDateFieldComponent from "metaform-react/MetaformDateFieldComponent";
import MetaformEmailFieldComponent from "metaform-react/MetaformEmailComponent";
import MetaformMemoComponent from "metaform-react/MetaformMemoComponent";
import MetaformNumberFieldComponent from "metaform-react/MetaformNumberFieldComponent";
import MetaformRadioFieldComponent from "metaform-react/MetaformRadioFieldComponent";
import MetaformSliderFieldComponent from "metaform-react/MetaformSliderFieldComponent";
import MetaformUrlFieldComponent from "metaform-react/MetaformUrlField";
import React from "react";
import fiLocale from "date-fns/locale/fi";
import MetaformDateTimeFieldComponent from "metaform-react/MetaformDateTimeFieldComponent";
import MetaformHtmlComponent from "metaform-react/MetaformHtmlComponent";
import MetaformFilesFieldComponent from "metaform-react/MetaformFilesFieldComponent";
import MetaformSelectFieldComponent from "metaform-react/MetaformSelectFieldComponent";
import MetaformTableFieldComponent from "metaform-react/MetaformTableFieldComponent";
import MetaformSubmitFieldComponent from "metaform-react/MetaformSubmitFieldComponent";

interface Prop {
  field: MetaformField;
  fieldLabelId: string;
  fieldId: string;
}

/**
 * Metaform field renderer component
 * TODO use metaform react component
 */
const FieldRenderer: React.FC<Prop> = ({
  field,
  fieldId,
  fieldLabelId
}) => {
  /**
   * Implement later
   */
  const renderIcon = () => (
    <Typography>
      { strings.generic.notImplemented }
    </Typography>
  );

  /**
   * Date picker
   */
  const datePicker = () => (
    <LocalizationProvider dateAdapter={ AdapterDateFns } locale={ fiLocale }>
      <DatePicker
        onChange={ () => {} }
        value={ new Date() }
        views={["day", "month", "year"]}
        renderInput={ params =>
          <TextField label={ strings.formComponent.dateTimePicker } { ...params }/>
        }
      />
    </LocalizationProvider>
  );

  /**
   * Date picker
   */
  const dateTimePicker = () => (
    <LocalizationProvider dateAdapter={ AdapterDateFns } locale={ fiLocale }>
      <DateTimePicker
        onChange={ () => {} }
        value={ new Date() }
        renderInput={ params =>
          <TextField label={ strings.formComponent.dateTimePicker } { ...params }/>
        }
      />
    </LocalizationProvider>
  );

  /**
   * Component render
   */
  switch (field.type) {
    case MetaformFieldType.Submit:
      return (
        <MetaformSubmitFieldComponent
          field={ field }
          formReadOnly={ true }
          validationErrors={{}}
        />
      );
    case MetaformFieldType.Table:
      return (
        <MetaformTableFieldComponent
          field={ field }
          formReadOnly={ true }
          value={ field.name || "" }
          renderIcon={ renderIcon }
        />
      );
    case MetaformFieldType.Select:
      return (
        <MetaformSelectFieldComponent
          field={ field }
          formReadOnly={ true }
          value={ field.name || "" }
        />
      );
    case MetaformFieldType.Files:
      return (
        <MetaformFilesFieldComponent
          showButtonText="FileShowButtonText"
          deleteButtonText="FileDeleteButtonText"
          field={ field }
          fieldId={ fieldId }
          value={ field.name || "" }
          fieldLabelId={ fieldLabelId }
        />
      );
    case MetaformFieldType.Html:
      return (
        <MetaformHtmlComponent
          field={ field }
          fieldId={ fieldId }
          fieldLabelId={ fieldLabelId }
        />
      );
    case MetaformFieldType.DateTime:
      return (
        <MetaformDateTimeFieldComponent
          field={ field }
          datetimePicker={ dateTimePicker }
        />
      );
    case MetaformFieldType.Date:
      return (
        <MetaformDateFieldComponent
          field={ field }
          datePicker={ datePicker }
        />
      );
    case MetaformFieldType.Checklist:
      return (
        <MetaformChecklistFieldComponent
          value={ field.name || "" }
          field={ field }
          formReadOnly={ true }
          renderIcon={ renderIcon }
        />
      );
    case MetaformFieldType.Radio:
      return (
        <MetaformRadioFieldComponent
          renderIcon={ renderIcon }
          value={ field.name || "" }
          field={ field }
          fieldId={ fieldId }
          fieldLabelId={ fieldLabelId }
          formReadOnly={ true }
        />
      );
    case MetaformFieldType.Slider:
      return (
        <MetaformSliderFieldComponent
          field={ field }
          formReadOnly={ true }
          value={ field.max && field.min ? (field.max - field.min) / 2 : 0 }
        />
      );
    case MetaformFieldType.Url:
      return (
        <MetaformUrlFieldComponent
          field={ field }
          fieldId={ fieldId }
          fieldLabelId={ fieldLabelId }
          formReadOnly={ true }
          value={ field.name || "" }
        />
      );
    case MetaformFieldType.Email:
      return (
        <MetaformEmailFieldComponent
          field={ field }
          fieldId={ fieldId }
          fieldLabelId={ fieldLabelId }
          formReadOnly={ true }
          value={ field.name || "" }
        />
      );
    case MetaformFieldType.Number:
      return (
        <MetaformNumberFieldComponent
          field={ field }
          fieldId={ fieldId }
          fieldLabelId={ fieldLabelId }
          formReadOnly={ true }
          value={ field.name || "" }
        />
      );
    case MetaformFieldType.Memo:
      return (
        <MetaformMemoComponent
          field={ field }
          fieldId={ fieldId }
          fieldLabelId={ fieldLabelId }
          formReadOnly={ true }
          value={ field.name || "" }
        />
      );
    case MetaformFieldType.Boolean:
      return (
        <MetaformBooleanFieldComponent
          renderIcon={ renderIcon }
          field={ field }
          fieldId={ fieldId }
          fieldLabelId={ fieldLabelId }
          formReadOnly={ true }
          value="true"
        />
      );
    default:
      return (
        <TextField
          disabled={ true }
          key={ fieldId }
          value={ field.name }
          label={ fieldLabelId }
        />
      );
  }
};

export default FieldRenderer;