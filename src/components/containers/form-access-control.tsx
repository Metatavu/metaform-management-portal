/* eslint-disable react/jsx-no-useless-fragment */
import React, { useContext } from "react";
import { resetPermission, setMetaform } from "features/auth-slice";
import { useApiClient, useAppDispatch } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import strings from "localization/strings";
import Api from "api";
import { useParams } from "react-router-dom";

/**
 * Component for form screen access control
 */
const FormAccessControl: React.FC = ({ children }) => {
  const { formSlug } = useParams();
  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi } = apiClient;
  const dispatch = useAppDispatch();
  const errorContext = useContext(ErrorContext);

  /**
   * Loads permission
   */
  const loadPermission = async () => {
    try {
      const foundMetaform = await metaformsApi.findMetaform({
        metaformSlug: formSlug
      });

      dispatch(setMetaform(foundMetaform.id!));
    } catch (error) {
      errorContext.setError(strings.errorHandling.accessControl.loadPermission, error);
    }
  };

  React.useEffect(() => {
    loadPermission();
    return () => {
      dispatch(resetPermission());
    };
  }, []);

  return <>{ children }</>;
};

export default FormAccessControl;