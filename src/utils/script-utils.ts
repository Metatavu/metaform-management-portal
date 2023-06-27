/* eslint-disable @typescript-eslint/no-unused-vars */
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
  export const runScriptOnSpreadsheet = async (spreadsheetFile: Blob, script: string, nameClassifierEntries: NameClassifierEntry[]) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.read(spreadsheetFile.stream());
    // eslint-disable-next-line no-eval
    eval(script);
    const newFile = new Blob([await workbook.xlsx.writeBuffer()]);
    return newFile;
  };
}

export default ScriptUtils;