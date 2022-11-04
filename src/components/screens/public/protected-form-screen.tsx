import { useAppSelector } from "app/hooks";
import { selectIdpKeycloak } from "features/auth-slice";
import * as React from "react";
import PublicFormScreen from "./public-form-screen";

/**
 * Component for protected form screen
 */
const ProtectedFormScreen: React.FC = () => {
  const idpKeycloak = useAppSelector(selectIdpKeycloak);

  if (!idpKeycloak) {
    return null;
  }

  return <PublicFormScreen/>;
};

export default ProtectedFormScreen;