import { matchPath } from "react-router-dom";
import { NavigationLinks } from "types";

namespace NavigationUtils {

  /**
   * Gets translated navigation
   *
   * @param navigation navigation
   */
  export const getTranslatedNavigation = (navigation: NavigationLinks): string => ({
    [NavigationLinks.EDITOR]: "/editor",
    [NavigationLinks.FORMS]: "/forms",
    [NavigationLinks.USERS]: "/users"
  })[navigation];

  /**
   * Matches navigation
   *
   * @param path path
   */
  export const matchNavigation = (path: string): NavigationLinks => (
    Object.values(NavigationLinks)
      .find(navigation => !!matchPath(path, getTranslatedNavigation(navigation))) || NavigationLinks.FORMS
  );
}

export default NavigationUtils;