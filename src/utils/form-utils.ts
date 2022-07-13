import Api from "api";
import { Reply } from "generated/client";

/**
 * Utility class for form
 */
namespace FormUtils {
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
   * Creates url with default format for accessing uploaded file
   * 
   * @param id fileRef id
   */
  export const createDefaultFileUrl = (id: string) => {
    return `${Api.createDefaultUploadUrl()}?fileRef=${id}`;
  };

  /**
   * Creates owner key protected reply edit link 
   * 
   * @param replyId reply id
   * @param ownerKey owner key
   * @returns owner key protected reply edit link 
   */
  export const createOwnerKeyLink = (replyId: string, ownerKey: string) => {
    const { location } = window;
    return (new URL(`${location.protocol}//${location.hostname}:${location.port}?reply=${replyId}&owner-key=${ownerKey}`)).toString();
  };

  /**
   * Returns reply edit link
   * 
   * @returns reply edit link or null if not available
   */
  export const getReplyEditLink = (reply: Reply, ownerKey: string | undefined) => {
    if (!reply?.id || !ownerKey) {
      return null;
    }

    return createOwnerKeyLink(reply.id, ownerKey);
  };

}

export default FormUtils;