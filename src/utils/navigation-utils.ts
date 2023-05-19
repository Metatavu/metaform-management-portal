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
    [NavigationLinks.USERS]: "/admin/users",
    [NavigationLinks.SCRIPTS]: "/admin/scripts"
  })[navigation];

  /**
   * Matches navigation
   *
   * @param path path
   */
  export const matchNavigation = (path: string): NavigationLinks => (
    Object.values(NavigationLinks)
      .find(navigation => !!path.startsWith(getTranslatedNavigation(navigation))) || NavigationLinks.FORMS
  );
}

export default NavigationUtils;