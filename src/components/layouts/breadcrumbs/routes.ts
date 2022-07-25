import FormBreadcrumb from "./form-breadcrumb";
import strings from "localization/strings";
import DraftBreadcrumb from "./draft-breadcrumb";

/**
 * Routes for breadcrumb
 */
const routes = [
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
    path: "/admin/forms/:formSlug/answer",
    breadcrumb: FormBreadcrumb
  },
  {
    path: "/admin/forms/:formSlug/history",
    breadcrumb: strings.breadcrumb.history
  }
];

export default routes;