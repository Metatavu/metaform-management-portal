/**
 * Utility class for field contexts
 */
namespace ContextUtils {
  
  /**
   * Returns whether field context is within enabled contexts
   * 
   * @param enabledContexts enabled contexts
   * @param fieldContexts field contexts
   * @returns whether field context is within enabled contexts
   */
  export const isEnabledContext = (enabledContexts?: string[], fieldContexts?: string[]) => {
    if (enabledContexts === undefined || fieldContexts === undefined) {
      return true;
    }

    if (enabledContexts.length === 0 || fieldContexts.length === 0) {
      return true;
    }

    return !!enabledContexts.find(context => fieldContexts.includes(context));
  };
}

export default ContextUtils;