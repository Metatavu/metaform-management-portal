import { Metaform } from "generated/client";
import JSZip from "jszip";

namespace FileUtils {
  /**
   * Sends a blob to user for downloading
   *
   * @param data data as blob
   * @param filename download file name
   */
  export const downloadBlob = (data: Blob, filename: string) => {
    const downloadLink = document.createElement("a");
    const downloadUrl = window.URL.createObjectURL(data);
    document.body.appendChild(downloadLink);
    downloadLink.href = downloadUrl;
    downloadLink.download = filename;
    downloadLink.click();
    window.URL.revokeObjectURL(downloadUrl);
    downloadLink.remove();
  };

  /**
   * Export current metaform to ZIP
   *
   * @param draftForm Metaform
   */
  export const exportToZip = async (draftForm: Metaform) => {
    const zip = new JSZip();

    zip.file(`${draftForm.slug}.json`, JSON.stringify(draftForm, null, 2));
    const content = await zip.generateAsync({ type: "blob" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${draftForm.slug}.zip`;
    link.click();
  };
}

export default FileUtils;