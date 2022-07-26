import { ConceptCodeApi, Configuration } from "generated/codeserver-client";

/**
 * Client for code server
 */
export default class CodeServerClient {

  /**
   * Gets initialized conceptCode api
   *
   * @param basePath CodeServer base path
   */
  public static getConceptCodeApi(basePath: string) {
    return new ConceptCodeApi(CodeServerClient.getConfiguration(basePath));
  }

  /**
   * Gets api configuration
   *
   * @param basePath CodeServer base path
   */
  private static getConfiguration(basePath: string) {
    return new Configuration({
      basePath: basePath
    });
  }

}