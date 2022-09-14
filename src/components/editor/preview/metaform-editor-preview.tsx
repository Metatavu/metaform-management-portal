import { Metaform, MetaformField } from "generated/client";
import React from "react";
import strings from "localization/strings";
import MetaformComponent from "metaform-react/MetaformComponent";
import { LocalizationProvider, DatePicker, DateTimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Icon, TextField } from "@mui/material";
import FormAutocomplete from "components/generic/form-autocomplete";
import { IconName, FieldValue } from "metaform-react/types";
import { FormContainer } from "styled/generic/form";
import fiLocale from "date-fns/locale/fi";
import MetaformEditorPreviewHeader from "./metaform-editor-preview-header";
import { PreviewContainer } from "styled/editor/metaform-editor";

/**
 * Component properties
 */
interface Props {
  metaform: Metaform;
  titleColor?: string;
  previewRef: React.RefObject<HTMLDivElement>
}

/**
 * Metaform editor preview component
 */
const MetaformEditorPreview: React.FC<Props> = ({
  metaform,
  titleColor,
  previewRef
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
   * Method for setting date
   *
   * @param fieldName field name
   */
  const renderDatePicker = (fieldName: string) => {
    return (
      <LocalizationProvider dateAdapter={ AdapterDateFns } locale={ fiLocale }>
        <DatePicker
          value={ new Date() }
          onChange={ () => {} }
          views={["day", "month", "year"]}
          renderInput={ params =>
            <TextField label={ strings.formComponent.dateTimePicker } aria-label={ fieldName } { ...params }/>
          }
        />
      </LocalizationProvider>
    );
  };

  /**
   * Method for setting datetime
   */
  const renderDatetimePicker = (fieldName: string) => {
    return (
      <LocalizationProvider dateAdapter={ AdapterDateFns } locale={ fiLocale }>
        <DateTimePicker
          value={ new Date() }
          onChange={ () => {} }
          renderInput={ params =>
            <TextField label={ strings.formComponent.dateTimePicker } aria-label={ fieldName } { ...params }/>
          }
        />
      </LocalizationProvider>
    );
  };

  /**
   * Renders autocomplete component
   *
   * @param field field
   * @param readOnly form read only
   * @param value autocomplete form value
   */
  const renderAutocomplete = (field: MetaformField, readOnly: boolean, value: FieldValue) => {
    return (
      <FormAutocomplete
        field={ field }
        metaform={ metaform }
        setFieldValue={ () => {} }
        disabled={ readOnly }
        value={ value }
      />
    );
  };

  // TODO make preview has data
  return (
    <PreviewContainer ref={ previewRef }>
      <MetaformEditorPreviewHeader/>
      <FormContainer>
        <MetaformComponent
          form={ metaform }
          contexts={ ["FORM"] }
          formReadOnly={ false }
          titleColor={ titleColor }
          getFieldValue={ () => null }
          setFieldValue={ () => null }
          datePicker={ renderDatePicker }
          datetimePicker={ renderDatetimePicker }
          renderAutocomplete={ renderAutocomplete }
          uploadFile={ () => {} }
          onFileDelete={ () => {} }
          onFileShow={ () => {} }
          renderIcon={ renderIcon }
          onSubmit={ () => {} }
          saving={ false }
        />
      </FormContainer>
    </PreviewContainer>
  );
};

export default MetaformEditorPreview;