import { AttachmentsApi, Configuration, DraftsApi, MetaformsApi, RepliesApi } from "generated/client";

/**
 * Utility class for loading api with predefined configuration
 */
namespace Api {

  /**
   * Gets api configuration
   *
   * @param accessToken accessToken
   */
  export const getConfiguration = (accessToken: string) => {
    return new Configuration({
      basePath: process.env.REACT_APP_API_BASE_PATH,
      accessToken: accessToken
    });
  };

  /**
   * Gets the Metaforms API
   * 
   * @param accessToken accessToken
   */
  export const getMetaformsApi = (accessToken: string) => (
    new MetaformsApi(getConfiguration(accessToken))
  );

  /**
   * Gets the Attachments API
   * 
   * @param accessToken accessToken
   */
  export const getAttachmentsApi = (accessToken: string) => (
    new AttachmentsApi(getConfiguration(accessToken))
  );

  /**
   * Gets the Attachments API
   * 
   * @param accessToken accessToken
   */
  export const getDraftsApi = (accessToken: string) => (
    new DraftsApi(getConfiguration(accessToken))
  );

  /**
   * Gets the Attachments API
   * 
   * @param accessToken accessToken
   */
  export const getRepliesApi = (accessToken: string) => (
    new RepliesApi(getConfiguration(accessToken))
  );
}

export default Api;