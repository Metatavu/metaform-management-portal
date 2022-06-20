import strings from "localization/strings";
import { BreadcrumbComponentType } from "use-react-router-breadcrumbs";

/**
 * Custom component for form breadcrumbs
 *
 * Add get form name logic
 */
const FormBreadcrumb: BreadcrumbComponentType<"formSlug"> = ({ match }) => (
  <div>{ strings.generic.notImplemented }</div>
);

export default FormBreadcrumb;