import { BreadcrumbComponentType } from "use-react-router-breadcrumbs";
import React from "react";

/**
 * Custom component for form breadcrumbs
 */
const FormBreadcrumb: BreadcrumbComponentType<"formSlug"> = ({ match }) => {
  const { formSlug } = match.params;

  return (
    <div>{ formSlug }</div>
  );
};

export default FormBreadcrumb;