import FormBreadcrumb from "./form-breadcrumb";
import DraftBreadcrumb from "./draft-breadcrumb";
import ReplyBreadcrumb from "./reply-breadcrumb";
import LocalizationUtils from "utils/localization-utils";

/**
 * Gets localized routes
 *
 * @param locale locale
 */
const getLocalizedRoutes = (locale: string) => [
  {
    path: "/admin/",
    breadcrumb: LocalizationUtils.localizeBreadcrumbStrings("home", locale)
  },
  {
    path: "/admin/users/*",
    breadcrumb: LocalizationUtils.localizeBreadcrumbStrings("users", locale)
  },
  {
    path: "/admin/editor",
    breadcrumb: LocalizationUtils.localizeBreadcrumbStrings("editor", locale)
  },
  {
    path: "/admin/editor/:formSlug",
    breadcrumb: FormBreadcrumb
  },
  {
    path: "/admin/editor/:formSlug/:draftId",
    breadcrumb: DraftBreadcrumb
  },
  {
    path: "/admin/forms",
    breadcrumb: LocalizationUtils.localizeBreadcrumbStrings("forms", locale)
  },
  {
    path: "/admin/forms/data",
    breadcrumb: LocalizationUtils.localizeBreadcrumbStrings("data", locale)
  },
  {
    path: "/admin/forms",
    breadcrumb: LocalizationUtils.localizeBreadcrumbStrings("list", locale)
  },
  {
    path: "/admin/forms/:formSlug",
    breadcrumb: FormBreadcrumb
  },
  {
    path: "/admin/forms/:formSlug/answers",
    breadcrumb: LocalizationUtils.localizeBreadcrumbStrings("answers", locale)
  },
  {
    path: "/admin/forms/:formSlug/answers/:replyId",
    breadcrumb: ReplyBreadcrumb
  },
  {
    path: "/admin/forms/:formSlug/history",
    breadcrumb: LocalizationUtils.localizeBreadcrumbStrings("history", locale)
  }
];

export default getLocalizedRoutes;