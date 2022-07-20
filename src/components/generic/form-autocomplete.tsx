import * as React from "react";

import { Autocomplete, CircularProgress, TextField, Typography } from "@mui/material";
import CodeServerClient from "../../codeserver/client";
import { Metaform, MetaformField, MetaformFieldAutocompleteService, MetaformFieldSourceType } from "../../generated/client";
import { Attribute, Qfield } from "../../generated/codeserver-client";
import { FieldValue } from "metaform-react/types";
import Config from "app/config";
import strings from "../../localization/strings";
import { autocompleteErrorMessages, AutocompleteItem } from "../../metaform-react/types";

/**
 * Interface representing component properties
 */
interface Props {
  metaform: Metaform;
  field: MetaformField;
  disabled: boolean;
  value: FieldValue;
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
}

/**
 * Interface representing component state
 */
interface State {
  loading: boolean;
  items: AutocompleteItem[];
  inputValue: string;
  defaultValue?: AutocompleteItem;
  errorMessage: string;
}

/**
 * React component displaying form autocomplete fields
 */
export default class FormAutocomplete extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      items: [],
      inputValue: "",
      errorMessage: ""
    };
  }

  /**
   * Component did mount life cycle event
   */
  public async componentDidMount() {
    const { value, setFieldValue } = this.props;

    this.setState({
      loading: true
    });

    try {
      const loadedItems = await this.loadItems();
      const defaultAutoCompleteItem = loadedItems.find(item => item.id === value as string);

      this.setState({
        items: loadedItems,
        loading: false,
        defaultValue: defaultAutoCompleteItem ? { ...defaultAutoCompleteItem } : defaultAutoCompleteItem
      });

      this.getSourceFields().forEach(sourceField => {
        if (sourceField.name) {
          const itemProperty = sourceField.source?.options?.autocompleteItemProperty;
          const itemValue = itemProperty && defaultAutoCompleteItem ? defaultAutoCompleteItem[itemProperty] : null;
          setFieldValue(sourceField.name, itemValue);
        }
      });
    } catch (e: any) {
      this.setState({
        loading: false,
        errorMessage: e.message
      });
    }
  }

  /**
   * Renders loader
   */
  // eslint-disable-next-line class-methods-use-this
  private renderLoader = () => {
    return (
      <div>
        <CircularProgress size={ 20 }/>
        <Typography>{ strings.generic.loadingAutoCompleteOptions }</Typography>
      </div>
    );
  };

  /**
   * Renders autocomplete error message
   */
  private renderErrorMessage = () => {
    const { errorMessage } = this.state;

    return (
      <div style={{ paddingLeft: "10px" }}>
        <Typography style={{ fontSize: "0.6rem" }} variant="caption" color="error">{ errorMessage }</Typography>
      </div>
    );
  };

  /**
   * Loads autocomplete items
   * 
   * @returns autocomplete items
   */
  private loadItems = async () => {
    const { field } = this.props;
    const { autocomplete } = field;
    
    if (!autocomplete) {
      throw new Error(autocompleteErrorMessages.MISSING_AUTO_COMPLETE);
    }

    switch (autocomplete.service) {
      case MetaformFieldAutocompleteService.CodeServerConceptCode:
        return this.loadCodeServerConceptCodeItems();
      default:
        throw new Error(autocompleteErrorMessages.UNKNOWN_AUTO_COMPLETE_SERVICE);
    }
  };

  /**
   * Loads autocomplete items for code server concept code service
   * 
   * @returns autocomplete items for code server concept code service
   */
  private loadCodeServerConceptCodeItems = async () => {
    const { field } = this.props;
    const { autocomplete } = field;

    if (!autocomplete) {
      throw new Error(autocompleteErrorMessages.MISSING_AUTO_COMPLETE);
    }

    const { options } = autocomplete;
    
    if (!options) {
      throw new Error(autocompleteErrorMessages.MISSING_OPTIONS);
    }

    const { codeServerBaseUrl, codeServerClassificationId, codeServerParentConceptCodeId } = options;
    if (!codeServerBaseUrl) {
      throw new Error(autocompleteErrorMessages.MISSING_CODE_SERVER_BASE_URL);
    }

    if (!codeServerClassificationId) {
      throw new Error(autocompleteErrorMessages.MISSING_CODE_SERVER_CLASSIFICATION_ID);
    }

    if (!codeServerParentConceptCodeId) {
      throw new Error(autocompleteErrorMessages.MISSING_CODE_SERVER_PARENT_CONCEPT_CODE_ID);
    }

    const corsProxy = Config.getCorsProxy();
    const conceptCodeApi = CodeServerClient.getConceptCodeApi(`${corsProxy}/${codeServerBaseUrl}`);
    
    const response = await conceptCodeApi.getConceptCodesFromDefaultVersion({
      classificationId: codeServerClassificationId,
      qfield: [ Qfield.PARENTID ],
      qvalue: codeServerParentConceptCodeId
    });
    
    const items: AutocompleteItem[] = (response.conceptCodes || []).map(conceptCodes => {
      return (conceptCodes.attributes || [])
        .filter(attribute => attribute.attributeName && attribute.attributeValue)
        .reduce((mapped: { [key: string]: string }, attribute: Attribute) => {
          const key = attribute.attributeName!!;
          const value = (attribute.attributeValue || []).join(",");
          mapped[key] = value;
          return mapped;
        }, { id: conceptCodes.conceptCodeId!! }) as AutocompleteItem;
    });

    return items;
  };

  /**
   * Returns label for autocomplete item
   * 
   * @param autocompleteItem autocomplete item
   * @returns label
   */
  private getAutocompleteOptionLabel = (autocompleteItem: AutocompleteItem) => {
    const { field } = this.props;
    const { autocomplete } = field;

    if (!autocomplete) {
      return "Unknown";
    }

    switch (autocomplete.service) {
      case MetaformFieldAutocompleteService.CodeServerConceptCode:
        return autocompleteItem.Abbreviation;
      default:
        return "Unknown";
    }
  };

  /**
   * Returns fields that use this autocomplete field as source
   * 
   * @returns fields that use this autocomplete field as source
   */
  private getSourceFields = () => {
    const { metaform, field } = this.props;

    return (metaform.sections || [])
      .flatMap(section => section.fields || [])
      .filter(sourceField => sourceField.source?.type === MetaformFieldSourceType.Autocomplete)
      .filter(sourceField => sourceField.source?.options?.autocompleteField === field.name);
  };

  /**
   * Event handler for autocomplete change
   * 
   * @param _event event
   * @param value new value
   */
  private onAutocompleteChange = (_event: React.ChangeEvent<{}>, value: AutocompleteItem | null) => {
    const { setFieldValue, field } = this.props;

    if (field.name) {
      setFieldValue(field.name, value?.id || null);
    }
    
    this.getSourceFields().forEach(sourceField => {
      if (sourceField.name) {
        const itemProperty = sourceField.source?.options?.autocompleteItemProperty;
        const itemValue = itemProperty && value ? value[itemProperty] : null;
        setFieldValue(sourceField.name, itemValue);
      }
    });
  };

  /**
   * Event handler for autocomplete input change
   * 
   * @param _event event
   * @param newInputValue new input value
   */
  private onAutocompleteInputChange = (_event: React.ChangeEvent<{}>, newInputValue: string) => {
    this.setState({
      inputValue: newInputValue
    });
  };

  /**
   * Equality check between option and value
   * 
   * @param option option
   * @param value value
   * 
   * @returns boolean representing whether a option is equal to a value
   */
  // eslint-disable-next-line class-methods-use-this
  private getOptionSelected = (option: AutocompleteItem, value: AutocompleteItem) => {
    return option.id === value.id;
  };

  /** 
   * Component render method
   */
  public render() {
    const { field, disabled, value } = this.props;

    const {
      items,
      inputValue,
      defaultValue,
      loading,
      errorMessage
    } = this.state;

    const selectedAutocompleteItem = items.find(item => item.id === value as string);

    if (errorMessage) {
      return this.renderErrorMessage();
    }

    if (loading || (!items && !errorMessage)) {
      return this.renderLoader();
    }

    return (
      <Autocomplete<AutocompleteItem>
        id={ field.name }
        disabled={ disabled }
        options={ items }
        inputValue={ inputValue }
        onInputChange={ this.onAutocompleteInputChange }
        defaultValue={ defaultValue }
        value={ selectedAutocompleteItem }
        getOptionLabel={ this.getAutocompleteOptionLabel }
        isOptionEqualToValue={ this.getOptionSelected }
        onChange={ this.onAutocompleteChange }
        renderInput={params => <TextField {...params} variant="outlined" InputProps={{ ...params.InputProps }}/> }
      />
    );
  }

}