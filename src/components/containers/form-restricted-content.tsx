/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState } from "react";
import { selectPermissionLevel } from "features/auth-slice";
import { PermissionLevel } from "types";
import { useAppSelector } from "app/hooks";

/**
 * Component props
 */
interface Prop {
  restrictionLevel: PermissionLevel;
}

/**
 * Component for form restricted content
 */
const FormRestrictedContent: React.FC<Prop> = ({
  children,
  restrictionLevel
}) => {
  const permissionLevel = useAppSelector(selectPermissionLevel);
  const [ restricted, setRestricted ] = useState(false);

  React.useEffect(() => {
    if (permissionLevel >= restrictionLevel) {
      setRestricted(true);
    } else {
      setRestricted(false);
    }
  }, [ permissionLevel ]);

  if (restricted) {
    return null;
  }

  return <>{ children }</>;
};

export default FormRestrictedContent;