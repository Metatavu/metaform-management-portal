import { useAppSelector } from "app/hooks";
import { selectAccessToken } from "features/auth-slice";
import * as React from "react";
import PublicFormScreen from "./public-form-screen";

/**
 * Component for protected form screen
 */
const ProtectedFormScreen: React.FC = () => {
  const accessToken = useAppSelector(selectAccessToken);

  if (!accessToken) {
    return null;
  }

  return <PublicFormScreen/>;
};

export default ProtectedFormScreen;