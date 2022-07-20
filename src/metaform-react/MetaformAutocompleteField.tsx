import React from "react";
import { MetaformField } from "generated/client";
import { FieldValue } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  formReadOnly: boolean;
  value: FieldValue;
  renderAutocomplete: (field: MetaformField, readOnly: boolean, value: FieldValue) => JSX.Element;
  onFocus: () => void;
}

/**
 * Component state
 */
interface State {
}

/**
 * Component for Metaform autocomplete field
 */
export class MetaformAutocompleteFieldComponent extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
    };
  }
  
  /**
   * Component render method
   */
  public render() {
    const {
      field,
      formReadOnly,
      value,
      renderAutocomplete
    } = this.props;

    return renderAutocomplete(field, field.readonly || formReadOnly, value);
  }
  
}

export default MetaformAutocompleteFieldComponent;