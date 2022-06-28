import { matchPath } from "react-router-dom";
import { NavigationLinks } from "types";

namespace NavigationUtils {

  /**
   * Gets translated navigation
   *
   * @param navigation navigation
   */
  export const getTranslatedNavigation = (navigation: NavigationLinks): string => ({
    [NavigationLinks.EDITOR]: "/admin/editor",
    [NavigationLinks.FORMS]: "/admin/forms",
    [NavigationLinks.USERS]: "/admin/users"
  })[navigation];

  /**
   * Matches navigation
   *
   * @param path path
   */
  export const matchNavigation = (path: string): NavigationLinks => (
    Object.values(NavigationLinks)
      .find(navigation => !!matchPath(getTranslatedNavigation(navigation), `/${path.split("/")[1]}`)) || NavigationLinks.FORMS
  );
}

export default NavigationUtils;