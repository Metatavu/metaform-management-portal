import { BreadcrumbComponentType } from "use-react-router-breadcrumbs";
import React from "react";

/**
 * Custom component for generic objects with ids breadcrumbs
 */
const GenericIdBreadcrumb: BreadcrumbComponentType<"replyId"> = ({ match }) => {
  const { replyId } = match.params;

  return (
    <div>{ replyId }</div>
  );
};

export default GenericIdBreadcrumb;