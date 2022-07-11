/* eslint-disable */ // Remove when refactoring is done
import React, { ReactNode } from "react";
import { MetaformField, MetaformTableColumn, MetaformTableColumnType } from "../generated/client/models";
import { FieldValue, IconName, Strings, TableFieldValue, TableFieldRowValue, TableFieldCellValue } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  formReadOnly: boolean,
  value: FieldValue,
  renderIcon: (icon: IconName, key: string) => ReactNode;
  onValueChange: (value: FieldValue) => void;
}

/**
 * Component state
 */
interface State {
  rowValues : TableFieldValue;
}

/**
 * Component for table field
 */
export class MetaformTableFieldComponent extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      rowValues : this.props.value as TableFieldValue || [{}]
    };
  }

  /**
   * Component render method
   */
  public render() {
    const { field } = this.props;

    if (!field.name) {
      return null;
    }

    return (
      <div>
        <table style={{ width: "100%" }}>
          { this.renderHeader() }
          { this.renderBody() }
        </table>
        <div>
          { this.renderAddRowButton() }
        </div>
      </div>
    );
  }

  /**
   * Renders table header
   */
  private renderHeader = () => {
    const { field } = this.props;
    const columns = field.columns || [];
    
    return (
      <thead>
        <tr>
          { columns.map(this.renderHeaderColumn) }
        </tr>
      </thead>
    );
  }

  /**
   * Renders table header column
   * 
   * @param column column
   */
  private renderHeaderColumn = (column: MetaformTableColumn) => {
    return (
      <th style={{ textAlign: "left" }} key={ column.name }> { column.title } </th>
    );
  }

  /**
   * Renders table body
   */
  private renderBody = () => {
    const { rowValues } = this.state;

    return (
      <tbody>
        {
          rowValues.map(this.renderRow)
        }
      </tbody>
    );
  }

  /**
   * Renders an add row button
   */
  private renderAddRowButton = () => {
    const { field, formReadOnly, renderIcon } = this.props;

    if (field.addRows === false) {
      return null;
    }

    if (formReadOnly || field.readonly) {
      return null;
    }
    
    return (
      <a style={{ cursor: "pointer" }} onClick={ this.onAddRowButtonClick }>
        { renderIcon("add", "add") }
        <span style={{ verticalAlign: "super" }}>Lisää uusi rivi</span>
      </a>
    );
  }

  /**
   * Renders row element
   * 
   * @param rowNumber row number
   * @param rowValue row value
   */
  private renderRow = (rowValue: TableFieldRowValue, rowNumber: number) => {
    const { field } = this.props;
    const columns = field.columns || [];

    return (
      <tr key={ rowNumber }>
        {
          columns.map(column => {
            return this.renderCell(rowNumber, column, rowValue[column.name] || null);
          })
        }
      </tr>
    );
  }

  /**
   * Renders cell element
   * 
   * @param rowNumber row number
   * @param column column
   * @param value value
   */
  private renderCell = (rowNumber: number, column: MetaformTableColumn, value: TableFieldCellValue) => {
    return (
      <td key={ column.name }>
        {
          this.renderCellInput(rowNumber, column, value)
        }
      </td>
    );
  }

  /**
   * Renders cell input element
   * 
   * @param rowNumber row number
   * @param column column
   * @param value value
   */
  private renderCellInput = (rowNumber: number, column: MetaformTableColumn, value: TableFieldCellValue) => {
    switch (column.type) {
      case MetaformTableColumnType.Text:
        return this.renderCellInputText(rowNumber, column, value);
      case MetaformTableColumnType.Number:
        return this.renderCellInputNumber(rowNumber, column, value);
      default:
        return <div style={{ color: "red" }}> Unknown column type { column.type } </div>;
    }
  }

  /**
   * Renders text cell input element
   * 
   * @param rowNumber row number
   * @param column column
   * @param value value
   */
  private renderCellInputText = (rowNumber: number, column: MetaformTableColumn, value: TableFieldCellValue) => {
    const { field, formReadOnly } = this.props;

    return (
      <input 
        value={ value || "" } 
        key={ column.name } 
        style={{ width: "100%", padding: 5 }} 
        readOnly={ formReadOnly || field.readonly }
        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onCellInputTextChange(rowNumber, column, event.target.value) }
      />
    );
  }

  /**
   * Renders number cell input element
   * 
   * @param rowNumber row number
   * @param column column
   * @param value value
   */
  private renderCellInputNumber = (rowNumber: number, column: MetaformTableColumn, value: TableFieldCellValue) => {
    const { field, formReadOnly } = this.props;
    
    return (
      <input 
        value={ value || "" }
        type={ "number" } 
        key={ column.name } 
        style={{ width: "100%", padding: 5 }} 
        readOnly={ formReadOnly || field.readonly }
        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onCellInputNumberChange(rowNumber, column, event.target.value) }
      />
    );
  }

  /**
   * Sets cell value
   * 
   * @param rowNumber row number
   * @param column column
   * @param value new value
   */
  private setTableFieldCellValue = (rowNumber: number, column: MetaformTableColumn, value: TableFieldCellValue) => {
    const rowValues = [ ...this.state.rowValues ];

    rowValues[rowNumber][column.name] = value;
    this.onTableValueChange(rowValues);
  }

  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  private onCellInputTextChange = (rowNumber: number, column: MetaformTableColumn, value: string) => {
    this.setTableFieldCellValue(rowNumber, column, value);
  }

  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  private onCellInputNumberChange = (rowNumber: number, column: MetaformTableColumn, value: string) => {
    this.setTableFieldCellValue(rowNumber, column, parseFloat(value));
  }

  /**
   * Event handler for add button click
   */
  private onAddRowButtonClick = () => {
    const { rowValues } = this.state;

    rowValues.push({});
    this.onTableValueChange(rowValues);
  }

  /**
   * Sets draft and state data
   * 
   * @param rowValues row values
   */
  private onTableValueChange = (rowValues: TableFieldValue) => {
    const { onValueChange } = this.props;

    this.setState({rowValues: rowValues});
    onValueChange(rowValues);
  }

}