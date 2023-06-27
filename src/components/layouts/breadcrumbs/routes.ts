import FormBreadcrumb from "./form-breadcrumb";
import DraftBreadcrumb from "./draft-breadcrumb";
import ReplyBreadcrumb from "./reply-breadcrumb";
import strings from "localization/strings";

strings.setLanguage("fi");

/**
 * Gets localized routes
 */
const getRoutes = () => [
  {
    path: "/admin/",
    breadcrumb: strings.breadcrumb.home
  },
  {
    path: "/admin/users/*",
    breadcrumb: strings.breadcrumb.users
  },
  {
    path: "/admin/editor",
    breadcrumb: strings.breadcrumb.editor
  },
  {
    path: "/admin/scripts",
    breadcrumb: strings.breadcrumb.scripts
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
    breadcrumb: strings.breadcrumb.forms
  },
  {
    path: "/admin/forms/data",
    breadcrumb: strings.breadcrumb.data
  },
  {
    path: "/admin/forms",
    breadcrumb: strings.breadcrumb.list
  },
  {
    path: "/admin/forms/:formSlug",
    breadcrumb: FormBreadcrumb
  },
  {
    path: "/admin/forms/:formSlug/answers",
    breadcrumb: strings.breadcrumb.answers
  },
  {
    path: "/admin/forms/:formSlug/answers/:replyId",
    breadcrumb: ReplyBreadcrumb
  },
  {
    path: "/admin/forms/:formSlug/history",
    breadcrumb: strings.breadcrumb.history
  }
];

export default getRoutes;