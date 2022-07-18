import { AttachmentsApi, Configuration, DraftsApi, MetaformsApi, RepliesApi } from "../generated/client";
import Config from "../app/config";
import { AccessToken } from "types";

/**
 * Utility class for loading api with predefined configuration
 */
namespace Api {

  /**
   * Gets initialized metaforms api
   *
   * @param accessToken access token
   */
  export const getMetaformsApi = (accessToken: AccessToken) => {
    return new MetaformsApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized replies api
   *
   * @param accessToken access token
   */
  export const getRepliesApi = (accessToken: AccessToken) => {
    return new RepliesApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized drafts api
   *
   * @param accessToken access token
   */
  export const getDraftsApi = (accessToken: AccessToken) => {
    return new DraftsApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized attachments api
   * 
   * @param accessToken access token
   */
  export const getAttachmentsApi = (accessToken: AccessToken) => {
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
  export const getConfiguration = (accessToken: AccessToken) => {
    return new Configuration({
      basePath: process.env.REACT_APP_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

}

export default Api;