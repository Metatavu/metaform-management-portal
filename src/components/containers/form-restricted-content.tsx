/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState } from "react";
import { selectKeycloak } from "features/auth-slice";
import { useAppSelector } from "app/hooks";
import { useNavigate } from "react-router-dom";
import AuthUtils from "utils/auth-utils";

interface Prop {
  route?: boolean
}

/**
 * Component for form restricted view
 */
const FormRestrictedContent: React.FC<Prop> = ({
  children,
  route
}) => {
  const keycloak = useAppSelector(selectKeycloak);
  const [ restricted, setRestricted ] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (AuthUtils.isSystemAdmin(keycloak)) {
      setRestricted(false);
    } else {
      setRestricted(true);
      if (route) {
        navigate(-1);
      }
    }
  }, [ keycloak ]);

  if (restricted) {
    return null;
  }

  return <>{ children }</>;
};

export default FormRestrictedContent;