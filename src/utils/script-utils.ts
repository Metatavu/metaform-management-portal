import ExcelJS from "exceljs";

namespace ScriptUtils {
  interface NameClassifierEntry {
    name: string;
    classifier: string;
  }

  /**
   * Runs a script on a spreadsheet
   * 
   * @param spreadsheetFile spreadsheet
   * @param script  script
   * @param nameClassifierEntries field names and classifiers
   */
  export const runScriptsOnSpreadsheet = async (spreadsheetFile: Blob, script: string, nameClassifierEntries: NameClassifierEntry[]) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.read(spreadsheetFile.stream());

    const totalOfAppliedAidFields = nameClassifierEntries.filter(entry => entry.classifier === "total-of-applied-aid");
    const mainSheet = workbook.worksheets[0];
    mainSheet.columns.forEach((column, columnIndex) => {
      const columnTitle = column.values ? column.values[1] : undefined;
      const isTotalOfAppliedAid = !!totalOfAppliedAidFields.find(field => field.name === columnTitle?.toString());
      
      if (isTotalOfAppliedAid) {
        const sumColumn: any[] = [`Summa - ${columnTitle?.toString()}`];
        const currentValues = column.values?.map(value => value as any) || [];
        currentValues.shift();
        mainSheet.spliceColumns(columnIndex + 1, 1, currentValues, sumColumn);
        column.values?.forEach((value, row) => {
          const tableName = value?.toString();
          if (tableName && row !== 1) {
            const tableSheet = workbook.worksheets.find(sheet => sheet.name === tableName);
            const cellAddress = tableSheet?.lastRow?.getCell("B").address;
            mainSheet.getCell(row, columnIndex + 2).value = { formula: `='${tableName}'!${cellAddress}`, date1904: false };
          }
        });
      }
    });
    // eslint-disable-next-line no-eval
    eval(script);
    const newFile = new Blob([await workbook.xlsx.writeBuffer()]);
    return newFile;
  };
}

export default ScriptUtils;