import React, { useEffect, useState } from "react";

import { Autocomplete, CircularProgress, TextField, Typography } from "@mui/material";
import CodeServerClient from "../../codeserver/client";
import { Metaform, MetaformField, MetaformFieldAutocompleteService, MetaformFieldSourceType } from "../../generated/client";
import { FieldValue } from "metaform-react/types";
import Config from "app/config";
import strings from "../../localization/strings";
import { autocompleteErrorMessages, AutocompleteItem } from "../../metaform-react/types";
import { Attribute, Qfield } from "generated/client/codeserver-client";

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
 * React component displaying form autocomplete fields
 */
const FormAutocomplete: React.FC<Props> = ({
  metaform,
  field,
  disabled,
  value,
  setFieldValue
}) => {
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ items, setItems ] = useState<AutocompleteItem[]>([]);
  const [ defaultValue, setDefaultValue ] = useState<AutocompleteItem | undefined>(undefined);
  const [ inputValue, setInputValue ] = useState<string>("");

  /**
   * Renders loader
   */
  const renderLoader = () => {
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
  const renderErrorMessage = () => {
    return (
      <div style={{ paddingLeft: "10px" }}>
        <Typography style={{ fontSize: "0.6rem" }} variant="caption" color="error">{ errorMessage }</Typography>
      </div>
    );
  };

  /**
   * Loads autocomplete items for code server concept code service
   * 
   * @returns autocomplete items for code server concept code service
   */
  const loadCodeServerConceptCodeItems = async () => {
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
    
    const autoCompleteItems: AutocompleteItem[] = (response.conceptCodes || []).map(conceptCodes => {
      return (conceptCodes.attributes || [])
        .filter(attribute => attribute.attributeName && attribute.attributeValue)
        .reduce((mapped: { [key: string]: string }, attribute: Attribute) => {
          const key = attribute.attributeName!!;
          const finalValue = (attribute.attributeValue || []).join(",");
          mapped[key] = finalValue;
          return mapped;
        }, { id: conceptCodes.conceptCodeId!! }) as AutocompleteItem;
    });

    return autoCompleteItems;
  };
  
  /**
   * Loads autocomplete items
   * 
   * @returns autocomplete items
   */
  const loadItems = async () => {
    const { autocomplete } = field;
      
    if (!autocomplete) {
      throw new Error(autocompleteErrorMessages.MISSING_AUTO_COMPLETE);
    }
  
    switch (autocomplete.service) {
      case MetaformFieldAutocompleteService.CodeServerConceptCode:
        return loadCodeServerConceptCodeItems();
      default:
        throw new Error(autocompleteErrorMessages.UNKNOWN_AUTO_COMPLETE_SERVICE);
    }
  };

  /**
   * Returns label for autocomplete item
   * 
   * @param autocompleteItem autocomplete item
   * @returns label
   */
  const getAutocompleteOptionLabel = (autocompleteItem: AutocompleteItem) => {
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
  const getSourceFields = () => {
    return (metaform.sections || [])
      .flatMap(section => section.fields || [])
      .filter(sourceField => sourceField.source?.type === MetaformFieldSourceType.Autocomplete)
      .filter(sourceField => sourceField.source?.options?.autocompleteField === field.name);
  };

  /**
   * Loading items
   */
  const loadingItems = async () => {
    setLoading(true);

    try {
      const loadedItems = await loadItems();
      const defaultAutoCompleteItem = loadedItems.find(item => item.id === value as string);

      setItems(loadedItems);
      setLoading(false);
      setDefaultValue(defaultAutoCompleteItem ? { ...defaultAutoCompleteItem } : defaultAutoCompleteItem);

      getSourceFields().forEach(sourceField => {
        if (sourceField.name) {
          const itemProperty = sourceField.source?.options?.autocompleteItemProperty;
          const itemValue = itemProperty && defaultAutoCompleteItem ? defaultAutoCompleteItem[itemProperty] : null;
          setFieldValue(sourceField.name, itemValue);
        }
      });
    } catch (e: any) {
      setLoading(false);
      setErrorMessage(e.message);
    }
  };

  /**
   * Component did mount life cycle event
   */
  useEffect(() => {
    loadingItems();
  }, []);

  /**
   * Event handler for autocomplete change
   *
   * @param _event event
   * @param itemValue new value
   */
  const onAutocompleteChange = (_event: React.ChangeEvent<{}>, itemValue: AutocompleteItem | null) => {
    if (field.name) {
      setFieldValue(field.name, itemValue?.id || null);
    }

    getSourceFields().forEach(sourceField => {
      if (sourceField.name) {
        const itemProperty = sourceField.source?.options?.autocompleteItemProperty;
        const itemPropertyValue = itemProperty && itemValue ? itemValue[itemProperty] : null;
        setFieldValue(sourceField.name, itemPropertyValue);
      }
    });
  };

  /**
   * Event handler for autocomplete input change
   * 
   * @param _event event
   * @param newInputValue new input value
   */
  const onAutocompleteInputChange = (_event: React.ChangeEvent<{}>, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  /**
   * Equality check between option and value
   * 
   * @param option option
   * @param itemValue value
   * 
   * @returns boolean representing whether a option is equal to a value
   */
  const getOptionSelected = (option: AutocompleteItem, itemValue: AutocompleteItem) => {
    return option.id === itemValue.id;
  };

  const selectedAutocompleteItem = items.find(item => item.id === value as string);

  if (errorMessage) {
    return renderErrorMessage();
  }

  if (loading || (!items && !errorMessage)) {
    return renderLoader();
  }

  return (
    <Autocomplete<AutocompleteItem>
      id={ field.name }
      disabled={ disabled }
      options={ items }
      inputValue={ inputValue }
      onInputChange={ onAutocompleteInputChange }
      defaultValue={ defaultValue }
      value={ selectedAutocompleteItem }
      getOptionLabel={ getAutocompleteOptionLabel }
      isOptionEqualToValue={ getOptionSelected }
      onChange={ onAutocompleteChange }
      renderInput={params => <TextField {...params} variant="outlined" InputProps={{ ...params.InputProps }}/> }
    />
  );
};
export default FormAutocomplete;