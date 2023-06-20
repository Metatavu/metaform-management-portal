import ExcelJS from "exceljs";

namespace ScriptUtils {
  interface NameClassifierEntry {
    name: string;
    classifier: string;
  }

  /**
   * Runs a script on a spreadsheet
   * 
   * @param spreadsheetFile 
   * @param script 
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
      }
    });
    // eslint-disable-next-line no-eval
    eval(script);
    const newFile = new Blob([await workbook.xlsx.writeBuffer()]);
    return newFile;
  };
}

export default ScriptUtils;