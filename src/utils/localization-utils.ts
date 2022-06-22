import strings from "localization/strings";
import moment from "moment";
import { NavigationLinks } from "types";

namespace LocalizationUtils {

  /**
   * Returns Finnish localized formatted date string
   *
   * @param date date
   */
  export const getLocalizedDate = (date?: Date): string => (date ? moment(date).format("DD.MM.YYYY") : "");

  /**
   * Returns Finnish localized formatted date time string
   *
   * @param date date
   */
  export const getLocalizedDateTime = (date?: Date): string => (date ? moment(date).format("DD.MM.YYYY HH:mm") : "");

  /**
   * Returns localized navigation link title and description
   *
   * @param navigationLink navigation link
   */
  export const getLocalizedNavigationLink = (navigationLink: NavigationLinks): string[] => ({
    [NavigationLinks.EDITOR]: [ strings.navigationHeader.editorScreens.title, strings.navigationHeader.editorScreens.description ],
    [NavigationLinks.FORMS]: [ strings.navigationHeader.formsScreens.title, strings.navigationHeader.formsScreens.description ],
    [NavigationLinks.USERS]: [ strings.navigationHeader.usersScreens.title, strings.navigationHeader.usersScreens.description ]
  })[navigationLink];

  /**
   * Returns localized name boolean value
   *
   * @param bool boolean value
   */
  export const getLocalizedBoolean = (bool: boolean): string => (bool ? strings.generic.yes : strings.generic.no);

}

export default LocalizationUtils;