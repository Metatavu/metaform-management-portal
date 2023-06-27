// import { Configuration } from "../generated/client";

import Config from "app/config";
import { AttachmentsApi, Configuration, ConfigurationParameters, DraftsApi, MetaformsApi, RepliesApi, MetaformMembersApi, MetaformMemberGroupsApi, VersionsApi, AuditLogEntriesApi, UsersApi, EmailNotificationsApi, MetaformStatisticsApi, ScriptsApi } from "generated/client";

/**
 * Utility class for loading api with predefined configuration
 */
namespace Api {

  /**
   * Returns function to get API client configuration object with given configuration
   *
   * @param Constructor constructable class of configuration for API client
   * @param basePath API base path
   * @param accessToken access token
   */
  const getConfigurationFactory = <T extends {}>(
    Constructor: new(params: ConfigurationParameters) => T,
    basePath: string,
    accessToken?: string
  ) => () => (
    new Constructor({
      basePath: basePath,
      accessToken: accessToken
    })
  );

  /**
   * Returns API client
   *
   * @param accessToken access token
   */
  export const getApiClient = (accessToken?: string) => {
    const getConfiguration = getConfigurationFactory(
      Configuration,
      Config.get().api.baseUrl,
      accessToken
    );

    return {
      draftsApi: new DraftsApi(getConfiguration()),
      repliesApi: new RepliesApi(getConfiguration()),
      metaformsApi: new MetaformsApi(getConfiguration()),
      attachmentsApi: new AttachmentsApi(getConfiguration()),
      metaformMembersApi: new MetaformMembersApi(getConfiguration()),
      metaformMemberGroupsApi: new MetaformMemberGroupsApi(getConfiguration()),
      versionsApi: new VersionsApi(getConfiguration()),
      auditLogEntriesApi: new AuditLogEntriesApi(getConfiguration()),
      usersApi: new UsersApi(getConfiguration()),
      emailNotificationsApi: new EmailNotificationsApi(getConfiguration()),
      metaformStatisticsApi: new MetaformStatisticsApi(getConfiguration()),
      scriptsApi: new ScriptsApi(getConfiguration())
    };
  };

  /**
   * Creates default file upload url
   */
  export const createDefaultUploadUrl = (): string => {
    return `${Config.get().api.baseUrl}/fileUpload`;
  };
}

export default Api;