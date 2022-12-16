import { TextField, Icon } from "@mui/material";
import { MetaformField, MetaformFieldType } from "generated/client";
import strings from "localization/strings";
import MetaformBooleanFieldComponent from "metaform-react/MetaformBooleanFieldComponent";
import MetaformChecklistFieldComponent from "metaform-react/MetaformChecklistFieldComponent";
import MetaformDateFieldComponent from "metaform-react/MetaformDateFieldComponent";
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
import MetaformTextFieldComponent from "metaform-react/MetaformTextFieldComponent";
import { IconName } from "metaform-react/types";
import MetaformEditableHtmlComponent from "metaform-react/MetaformEditableHtmlComponent";
import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface Prop {
  field: MetaformField;
  fieldLabelId: string;
  fieldId: string;
  key: string;
  focus: boolean;
  onFieldUpdate: (updatedField: MetaformField) => void
}

/**
 * Metaform field renderer component
 * TODO use metaform react component
 */
const AddableFieldRenderer: React.FC<Prop> = ({
  field,
  fieldId,
  fieldLabelId,
  focus,
  onFieldUpdate
}) => {
  /**
   * Method for rendering form icons
   * @param icon Icon
   * @param key IconKey
   */
  const renderIcon = (icon: IconName, key: string) => {
    return (
      <Icon key={ key }>{ icon }</Icon>
    );
  };

  /**
   * Date picker
   */
  const datePicker = () => (
    <LocalizationProvider dateAdapter={ AdapterDateFns } locale={ fiLocale }>
      <DatePicker
        disabled
        label={ strings.formComponent.datePicker }
        onChange={ () => {} }
        value={ new Date() }
        views={["day", "month", "year"]}
        renderInput={ params =>
          <TextField { ...params }/>
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
        disabled
        label={ strings.formComponent.dateTimePicker }
        onChange={ () => {} }
        value={ new Date() }
        renderInput={ params =>
          <TextField { ...params }/>
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
            columns: field.columns,
            addRows: true
          }}
          formReadOnly={ false }
          renderIcon={ renderIcon }
          value=""
        />
      );
    case MetaformFieldType.Select:
      return (
        <MetaformSelectFieldComponent
          value=""
          field={{
            ...field,
            name: field.name,
            options: field.options
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
          value=""
          fieldLabelId={ fieldLabelId }
        />
      );
    case MetaformFieldType.Html:
      if (focus) {
        return (
          <MetaformEditableHtmlComponent
            field={ field }
            onFieldUpdate={ onFieldUpdate }
          />
        );
      }
      return (
        <MetaformHtmlComponent
          notInteractive={ true }
          fieldId={ fieldId }
          field={ field }
        />
      );
    case MetaformFieldType.DateTime:
      return (
        <MetaformDateTimeFieldComponent
          field={ field }
          renderDatetimePicker={ dateTimePicker }
        />
      );
    case MetaformFieldType.Date:
      return (
        <MetaformDateFieldComponent
          field={ field }
          renderDatePicker={ datePicker }
        />
      );
    case MetaformFieldType.Checklist:
      return (
        <MetaformChecklistFieldComponent
          notInteractive={ true }
          value="a"
          field={{
            ...field,
            name: field.name,
            options: field.options
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
            name: field.name,
            title: field.title,
            options: field.options
          }}
          fieldId={ fieldId }
          formReadOnly={ false }
        />
      );
    case MetaformFieldType.Slider:
      return (
        <MetaformSliderFieldComponent
          notInteractive={ true }
          field={{
            ...field,
            name: field.name,
            title: field.title,
            max: field.max,
            min: field.min
          }}
          formReadOnly={ true }
          value={ field.max && field.min ? (field.max - field.min) / 2 : 0 }
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
          value={" "}
        />
      );
    case MetaformFieldType.Memo:
      return (
        <MetaformMemoComponent
          notInteractive={ true }
          field={ field }
          fieldId={ fieldId }
          formReadOnly={ true }
          value="Memo"
        />
      );
    case MetaformFieldType.Boolean:
      return (
        <MetaformBooleanFieldComponent
          notInteractive={ true }
          renderIcon={ renderIcon }
          field={ field }
          fieldId={ fieldId }
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
          formReadOnly={ true }
          value={" "}
        />
      );
  }
};

export default AddableFieldRenderer;