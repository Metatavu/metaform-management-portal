import { useAppSelector } from "app/hooks";
import { selectIdpKeycloak } from "features/auth-slice";
import * as React from "react";
import FormScreen from "./form-screen";

/**
 * Component for protected form screen
 */
const ProtectedFormScreen: React.FC = () => {
  const idpKeycloak = useAppSelector(selectIdpKeycloak);

  if (!idpKeycloak) {
    return null;
  }

  return <FormScreen/>;
};

export default ProtectedFormScreen;