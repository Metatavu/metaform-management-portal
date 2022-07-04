/* eslint-disable */ // Remove when refactoring is done
import { FieldRule } from '../generated/client/models';
import { FieldValue } from './types';

/**
 * Helper class for evaluating "visible if" rules
 */
class VisibileIfEvaluator {

  /**
   * Evaluates given visible if rule
   * 
   * @param fieldRule rule
   * @param getFieldValue method for retrieving form values
   * @returns whether rule evaluated as visible or hidden
   */
  public static isVisible = (fieldRule: FieldRule| undefined, getFieldValue: (fieldName: string) => FieldValue) => {
    if (!fieldRule) {
      return true;
    }

    let result: boolean = false;  

    const field = fieldRule.field;

    if (field && fieldRule.equals) {
      const equals = fieldRule.equals as FieldValue; 
      const fieldValue = getFieldValue(field);
      result = VisibileIfEvaluator.compareValues(equals, fieldValue);
    }

    if (!result && field && fieldRule.notEquals) {
      const notEquals = fieldRule.notEquals as FieldValue; 
      const fieldValue = getFieldValue(field);
      result = !VisibileIfEvaluator.compareValues(notEquals, fieldValue);
    }

    const ands = fieldRule.and || [];
    for (let i = 0; i < ands.length; i++) {
      if (!VisibileIfEvaluator.isVisible(ands[i], getFieldValue)) {
        return false;
      }
    }

    if (!result) {
      const ors = fieldRule.or || [];
      for (let i = 0; i < ors.length; i++) {
        if (VisibileIfEvaluator.isVisible(ors[i], getFieldValue)) {
          return true;
        }
      }
    }

    return result;
  }

  /**
   * Compares values and returns whether they should be considered as equal.
   * 
   * If one of values is an instance of number, both are converted to numbers before comparasion.
   * 
   * @param value1 value 1
   * @param value2 value 2
   * @returns whether values should be considered as equal.
   */
  private static compareValues(value1: FieldValue, value2: FieldValue): boolean {
    if (value1 === value2) {
      return true;
    }

    if (value2 === null || value1 === null) {
      return false;
    }

    if (typeof value1 === "number") {
      if (typeof value2 === "string") {
        return parseFloat(value2) === value1;
      }
    }

    if (typeof value2 === "number") {
      if (typeof value1 === "string") {
        return parseFloat(value1) === value2;
      }
    }
    
    return value1 === value2;
  }

}

export default VisibileIfEvaluator;