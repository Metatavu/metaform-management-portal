import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import strings from "localization/strings";
import React, { ReactNode } from "react";
import { AddRowButtonWrapper, TableNumberCellWrapper, TableTextCellWrapper, TableWrapper } from "styled/react-components/react-components";
import { MetaformField, MetaformTableColumn, MetaformTableColumnType } from "../generated/client/models";
import { FieldValue, IconName, TableFieldValue, TableFieldRowValue, TableFieldCellValue } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  formReadOnly: boolean,
  value: FieldValue,
  renderIcon: (icon: IconName, key: string) => ReactNode;
  onValueChange?: (value: FieldValue) => void;
  notInteractive?: boolean;
}

/**
 * Component for table field
 */
export const MetaformTableFieldComponent: React.FC<Props> = ({
  field,
  formReadOnly,
  value,
  renderIcon,
  onValueChange,
  notInteractive
}) => {
  const [ rowValues, setRowValues ] = React.useState<TableFieldValue>(value as TableFieldValue || [{}]);

  if (!field.name) {
    return null;
  }

  /**
   * Sets draft and state data
   * 
   * @param newRowValues new row values
   */
  const onTableValueChange = (newRowValues: TableFieldValue) => {
    const newTableValues = newRowValues as TableFieldValue;
    setRowValues(newTableValues);
    onValueChange && onValueChange(newTableValues);
  };

  /**
   * Event handler for add button click
   */
  const onAddRowButtonClick = () => {
    const newRowValues = [...rowValues];

    newRowValues.push({});
    onTableValueChange(newRowValues);
  };

  /**
   * Sets cell value
   * 
   * @param rowNumber row number
   * @param column column
   * @param cellValue new value
   */
  const setTableFieldCellValue = (rowNumber: number, column: MetaformTableColumn, cellValue: TableFieldCellValue) => {
    const newRowValues = [ ...rowValues ];

    newRowValues[rowNumber][column.name] = cellValue;
    onTableValueChange(newRowValues);
  };

  /**
   * Event handler for table text cell input change
   * 
   * @param rowNumber number of row
   * @param column column
   * @param cellValue new value
   */
  const onCellInputTextChange = (rowNumber: number, column: MetaformTableColumn, cellValue: string) => {
    setTableFieldCellValue(rowNumber, column, cellValue);
  };

  /**
   * Event handler for table number cell input change
   * 
   * @param rowNumber number of row
   * @param column column
   * @param cellValue new value
   */
  const onCellInputNumberChange = (rowNumber: number, column: MetaformTableColumn, cellValue: string) => {
    setTableFieldCellValue(rowNumber, column, parseFloat(cellValue));
  };

  /**
   * Renders an add row button
   */
  const renderAddRowButton = () => {
    if (field.addRows === false) {
      return null;
    }

    if (formReadOnly || field.readonly) {
      return null;
    }
    
    return (
      <AddRowButtonWrapper
        onClick={ onAddRowButtonClick }
        variant="contained"
        size="small"
      >
        { strings.fieldComponents.tableField.addNewRow }
        { renderIcon("add", "add") }
      </AddRowButtonWrapper>
    );
  };

  /**
   * Renders text cell input element
   * 
   * @param rowNumber row number
   * @param column column
   * @param cellValue value
   */
  const renderCellInputText = (rowNumber: number, column: MetaformTableColumn, cellValue: TableFieldCellValue) => {
    const style: React.CSSProperties = notInteractive ? { pointerEvents: "none" } : {};
    return (
      <TableTextCellWrapper
        value={ cellValue || "" }
        key={ column.name }
        InputProps={{
          style: style,
          readOnly: formReadOnly || field.readonly,
          disableUnderline: true,
          sx: {
            ".MuiOutlinedInput-notchedOutline": {
              border: "none"
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none"
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none"
            }
          }
        }}
        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => onCellInputTextChange(rowNumber, column, event.target.value) }
      />
    );
  };

  /**
   * Renders number cell input element
   * 
   * @param rowNumber row number
   * @param column column
   * @param cellValue value
   */
  const renderCellInputNumber = (rowNumber: number, column: MetaformTableColumn, cellValue: TableFieldCellValue) => {
    return (
      <TableNumberCellWrapper
        value={ cellValue || "" }
        type="number"
        key={ column.name }
        InputProps={{
          readOnly: formReadOnly || field.readonly,
          disableUnderline: true,
          sx: {
            ".MuiOutlinedInput-notchedOutline": {
              border: "none"
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none"
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none"
            }
          }
        }}
        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => onCellInputNumberChange(rowNumber, column, event.target.value) }
      />
    );
  };

  /**
   * Renders cell input element
   * 
   * @param rowNumber row number
   * @param column column
   * @param cellValue value
   */
  const renderCellInput = (rowNumber: number, column: MetaformTableColumn, cellValue: TableFieldCellValue) => {
    switch (column.type) {
      case MetaformTableColumnType.Text:
        return renderCellInputText(rowNumber, column, cellValue);
      case MetaformTableColumnType.Number:
        return renderCellInputNumber(rowNumber, column, cellValue);
      default:
        return (
          <div style={{ color: "red" }}>
            {" "}
            { strings.fieldComponents.tableField.unknownColumnType }
            {" "}
            { column.type }
            {" "}
          </div>
        );
    }
  };

  /**
   * Renders cell element
   * 
   * @param rowNumber row number
   * @param column column
   * @param cellValue value
   */
  const renderCell = (rowNumber: number, column: MetaformTableColumn, cellValue: TableFieldCellValue) => {
    return (
      <TableCell sx={{ padding: 0 }} key={ column.name }>
        {
          renderCellInput(rowNumber, column, cellValue)
        }
      </TableCell>
    );
  };

  /**
   * Renders row element
   * 
   * @param rowNumber row number
   * @param rowValue row value
   */
  const renderRow = (rowValue: TableFieldRowValue, rowNumber: number) => {
    const columns = field.columns || [];

    return (
      <TableRow key={ rowNumber }>
        {
          columns.map(column => {
            return renderCell(rowNumber, column, rowValue[column.name] || null);
          })
        }
      </TableRow>
    );
  };

  /**
   * Renders table body
   */
  const renderBody = () => {
    if (!rowValues) {
      return null;
    }

    return (
      <TableBody>
        {
          rowValues.map((rowValue, rowNumber) => {
            return renderRow(rowValue, rowNumber);
          })
        }
      </TableBody>
    );
  };

  /**
   * Renders table header column
   * 
   * @param column column
   */
  const renderHeaderColumn = (column: MetaformTableColumn) => {
    return (
      <TableCell
        sx={{
          textAlign: "left",
          padding: 0,
          borderBottom: "none"
        }}
        key={ column.name }
      >
        { column.title }
      </TableCell>
    );
  };

  /**
   * Renders table header
   */
  const renderHeader = () => {
    const columns = field.columns || [];
    
    return (
      <TableHead>
        <TableRow>
          { columns.map(renderHeaderColumn) }
        </TableRow>
      </TableHead>
    );
  };

  return (
    <TableWrapper>
      <table style={{ width: "100%" }}>
        { renderHeader() }
        { renderBody() }
      </table>
      <div>
        { renderAddRowButton() }
      </div>
    </TableWrapper>
  );
};

export default MetaformTableFieldComponent;