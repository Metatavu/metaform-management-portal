/**
 * Namespace for data validation utility functions
 */
export namespace DataValidation {

  /**
   * Validates that given value is not undefined or null
   * 
   * @param value value
   * @returns true if value is not undefined or null
   */
  export const validateValueIsNotUndefinedNorNull = <T extends Object> (value: null | undefined | T): value is T => {
    return value !== null && value !== undefined;
  };
}