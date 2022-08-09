import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TextField, Typography } from "@mui/material";
import { MetaformField, MetaformFieldType, MetaformTableColumnType } from "generated/client";
import strings from "localization/strings";
import MetaformBooleanFieldComponent from "metaform-react/MetaformBooleanFieldComponent";
import MetaformChecklistFieldComponent from "metaform-react/MetaformChecklistFieldComponent";
import MetaformDateFieldComponent from "metaform-react/MetaformDateFieldComponent";
import MetaformEmailFieldComponent from "metaform-react/MetaformEmailComponent";
import MetaformMemoComponent from "metaform-react/MetaformMemoComponent";
import MetaformNumberFieldComponent from "metaform-react/MetaformNumberFieldComponent";
import MetaformRadioFieldComponent from "metaform-react/MetaformRadioFieldComponent";
import MetaformSliderFieldComponent from "metaform-react/MetaformSliderFieldComponent";
import React from "react";
import fiLocale from "date-fns/locale/fi";
import MetaformDateTimeFieldComponent from "metaform-react/MetaformDateTimeFieldComponent";
import MetaformHtmlComponent from "metaform-react/MetaformHtmlComponent";
import MetaformFilesFieldComponent from "metaform-react/MetaformFilesFieldComponent";
import MetaformSelectFieldComponent from "metaform-react/MetaformSelectFieldComponent";
import MetaformTableFieldComponent from "metaform-react/MetaformTableFieldComponent";
import MetaformSubmitFieldComponent from "metaform-react/MetaformSubmitFieldComponent";
import MetaformUrlFieldComponent from "metaform-react/MetaformUrlField";
import MetaformTextFieldComponent from "metaform-react/MetaformTextFieldComponent";

interface Prop {
  field: MetaformField;
  fieldLabelId: string;
  fieldId: string;
}

/**
 * Metaform field renderer component
 * TODO use metaform react component
 */
const AddableFieldRenderer: React.FC<Prop> = ({
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
          <TextField
            style={{ pointerEvents: "none" }}
            label={ strings.formComponent.dateTimePicker }
            { ...params }
          />
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
          <TextField
            style={{ pointerEvents: "none" }}
            label={ strings.formComponent.dateTimePicker }
            { ...params }
          />
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
          notInteractive={ true }
          field={ field }
          formReadOnly={ true }
          validationErrors={{}}
        />
      );
    case MetaformFieldType.Table:
      return (
        <MetaformTableFieldComponent
          notInteractive={ true }
          field={{
            ...field,
            name: "Table",
            columns: [ { name: "a", type: MetaformTableColumnType.Text }, { name: "b", type: MetaformTableColumnType.Text }, { name: "c", type: MetaformTableColumnType.Text } ],
            addRows: true
          }}
          formReadOnly={ false }
          renderIcon={ renderIcon }
          value={[
            {
              a: "a",
              b: "b",
              c: "c"
            },
            {
              a: "a",
              b: "b",
              c: "c"
            }
          ]}
        />
      );
    case MetaformFieldType.Select:
      return (
        <MetaformSelectFieldComponent
          value="a"
          field={{
            ...field,
            name: "Select",
            options: [ { name: "a", text: "a" }, { name: "b", text: "b" }, { name: "c", text: "c" } ]
          }}
          formReadOnly={ false }
          notInteractive={ true }
        />
      );
    case MetaformFieldType.Files:
      return (
        <MetaformFilesFieldComponent
          notInteractive={ true }
          field={ field }
          fieldId={ fieldId }
          value={ field.name || "" }
          fieldLabelId={ fieldLabelId }
        />
      );
    case MetaformFieldType.Html:
      return (
        <MetaformHtmlComponent
          notInteractive={ true }
          fieldId={ fieldId }
          fieldLabelId={ fieldLabelId }
          field={{
            ...field,
            name: "Custom HTML",
            html: "<b>You can replace this with custom HTML</b>"
          }}
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
          notInteractive={ true }
          value="a"
          field={{
            ...field,
            name: "Checklist",
            options: [ { name: "a", text: "a" }, { name: "b", text: "b" }, { name: "c", text: "c" } ]
          }}
          formReadOnly={ false }
          renderIcon={ renderIcon }
        />
      );
    case MetaformFieldType.Radio:
      return (
        <MetaformRadioFieldComponent
          notInteractive={ true }
          renderIcon={ renderIcon }
          value="a"
          field={{
            ...field,
            name: "Radio",
            options: [ { name: "a", text: "a" }, { name: "b", text: "b" }, { name: "c", text: "c" } ]
          }}
          fieldId={ fieldId }
          fieldLabelId={ fieldLabelId }
          formReadOnly={ false }
        />
      );
    case MetaformFieldType.Slider:
      return (
        <MetaformSliderFieldComponent
          notInteractive={ true }
          field={ field }
          formReadOnly={ true }
          value={ field.max && field.min ? (field.max - field.min) / 2 : 0 }
        />
      );
    case MetaformFieldType.Url:
      return (
        <MetaformUrlFieldComponent
          value="https://google.com"
          field={ field }
          fieldId={ fieldId }
          fieldLabelId={ fieldLabelId }
          formReadOnly={ true }
        />
      );
    case MetaformFieldType.Email:
      return (
        <MetaformEmailFieldComponent
          notInteractive={ true }
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
          notInteractive={ true }
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
          notInteractive={ true }
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
          notInteractive={ true }
          renderIcon={ renderIcon }
          field={ field }
          fieldId={ fieldId }
          fieldLabelId={ fieldLabelId }
          formReadOnly={ false }
          value="true"
        />
      );
    default:
      return (
        <MetaformTextFieldComponent
          key={ fieldId }
          field={ field }
          fieldId={ fieldId }
          fieldLabelId={ fieldLabelId }
          formReadOnly={ true }
          value={ field.name || "" }
        />
      );
  }
};

export default AddableFieldRenderer;