/* eslint-disable react/jsx-no-useless-fragment */
import React, { useContext, useState } from "react";
import { selectPermissionLevel } from "features/auth-slice";
import { PermissionLevel } from "types";
import { useAppSelector } from "app/hooks";
import { useNavigate } from "react-router-dom";
import { ErrorContext } from "components/contexts/error-handler";
import strings from "localization/strings";

/**
 * Component props
 */
interface Prop {
  restrictedPermissionLevel: PermissionLevel;
}

/**
 * Component for form content restricted
 */
const FormContentRestricted: React.FC<Prop> = ({
  children,
  restrictedPermissionLevel
}) => {
  const permissionLevel = useAppSelector(selectPermissionLevel);
  const [ restricted, setRestricted ] = useState(false);
  const navigate = useNavigate();
  const { setError } = useContext(ErrorContext);

  React.useEffect(() => {
    if (permissionLevel <= restrictedPermissionLevel) {
      setRestricted(true)
      setError(strings.errorHandling.accessControl.contentNotPermitted)
      navigate(-1);
    }
  }, []);

  if (restricted) {
    return null
  }

  return <>{ children }</>;
};

export default FormContentRestricted;