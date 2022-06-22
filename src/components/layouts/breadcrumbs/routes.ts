import FormBreadcrumb from "./form-breadcrumb";
import strings from "localization/strings";
import DraftBreadcrumb from "./draft-breadcrumb";

/**
 * Routes for breadcrumb
 */
const routes = [
  {
    path: "/",
    breadcrumb: strings.breadcrumb.home
  },
  {
    path: "/users/*",
    breadcrumb: strings.breadcrumb.users
  },
  {
    path: "/editor",
    breadcrumb: strings.breadcrumb.editor
  },
  {
    path: "/editor/:formSlug",
    breadcrumb: FormBreadcrumb
  },
  {
    path: "/editor/:formSlug/:draftId",
    breadcrumb: DraftBreadcrumb
  },
  {
    path: "/forms",
    breadcrumb: strings.breadcrumb.forms
  },
  {
    path: "/forms/data",
    breadcrumb: strings.breadcrumb.data
  },
  {
    path: "/forms",
    breadcrumb: strings.breadcrumb.list
  },
  {
    path: "/forms/:formSlug",
    breadcrumb: FormBreadcrumb
  },
  {
    path: "/forms/:formSlug/answer",
    breadcrumb: strings.breadcrumb.answer
  },
  {
    path: "/forms/:formSlug/history",
    breadcrumb: strings.breadcrumb.history
  }
];

export default routes;