import Api from "api";
import { ErrorContext } from "components/contexts/error-handler";
import { resetPermission, selectKeycloak, setMetaform, setSystemAdminPermission } from "features/auth-slice";
import strings from "localization/strings";
import React, { useContext } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * Custom hook for accessing dispatch function for Redux state
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Custom hook for accessing selector function for redux state
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Custom hook for running given callback function in intervals
 *
 * @param callback callback function
 * @param delay delay as milliseconds
 */
export const useInterval = (callback: () => any, delay: number) => {
  const savedCallback = React.useRef<typeof callback>();

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    /**
     * Ticks the timer
     */
    const tick = () => {
      savedCallback.current && savedCallback.current();
    };

    const timeout = setInterval(tick, delay);
    return () => clearInterval(timeout);
  }, [ delay ]);
};

/**
 * Hook to debounce changes to given value
 *
 * @param value value
 * @param delay delay
 * @returns value updated with delay
 */
export const useDebounce = (value: string, delay: number) => {
  const [ debouncedValue, setDebouncedValue ] = React.useState(value);

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [ value, delay ]);

  return debouncedValue;
};

/**
 * Custom hook that provides API client from given getter method with up-to-date authentication from Redux.
 * Can only be used in components under Redux store provider.
 *
 * @param apiClientFactory factory function for creating API client
 */
export const useApiClient = <T extends {}>(apiClientFactory: (accessToken?: string) => T): T => {
  const { token } = useAppSelector(selectKeycloak) || {};
  return React.useMemo(() => apiClientFactory(token), [ token ]);
};

/**
 * Custom hook that provides form access control.
 */
export const useFormAccessControl = (formSlug?: string) => {
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
    if (formSlug !== undefined) {
      loadPermission();
    } else {
      dispatch(setSystemAdminPermission());
    }
    return () => {
      dispatch(resetPermission());
    };
  }, []);
};