import { BreadcrumbComponentType } from "use-react-router-breadcrumbs";

/**
 * Custom component for form breadcrumbs
 *
 * Add get form name logic
 */
const DraftBreadcrumb: BreadcrumbComponentType<"draftId"> = ({ match }) => {
  const { draftId } = match.params;

  return (
    <div>{ draftId }</div>
  );
}

export default DraftBreadcrumb;