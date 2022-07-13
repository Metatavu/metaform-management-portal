import { AttachmentsApi, Configuration, DraftsApi, MetaformsApi, RepliesApi } from "../generated/client";
import Config from "../app/config";

/**
 * Utility class for loading api with predefined configuration
 */
namespace Api {

  /**
   * Gets initialized metaforms api
   *
   * @param accessToken access token
   */
  export const getMetaformsApi = (accessToken: string) => {
    return new MetaformsApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized replies api
   *
   * @param accessToken access token
   */
  export const getRepliesApi = (accessToken: string) => {
    return new RepliesApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized drafts api
   *
   * @param accessToken access token
   */
  export const getDraftsApi = (accessToken: string) => {
    return new DraftsApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized attachments api
   * 
   * @param accessToken access token
   */
  export const getAttachmentsApi = (accessToken: string) => {
    return new AttachmentsApi(Api.getConfiguration(accessToken));
  };

  /**
   * Creates default file upload url
   */
  export const createDefaultUploadUrl = (): string => {
    return `${Config.getApiBaseUrl()}/fileUpload`;
  };

  /**
   * Gets api configuration
   *
   * @returns new configuration
   */
  export const getConfiguration = (accessToken: string) => {
    return new Configuration({
      basePath: process.env.REACT_APP_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

}

export default Api;