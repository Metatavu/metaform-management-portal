/* eslint-disable react/jsx-no-constructed-context-values */
import Api from "api";
import { useAppSelector } from "app/hooks";
import { selectKeycloak } from "features/auth-slice";
import { FindMetaformRequest } from "generated/client";
import React from "react";
import { MetaformsApiContextType } from "types";

const initialMetaform = {};

export const MetaformsApiContext = React.createContext<MetaformsApiContextType>({
  findMetaform: async () => initialMetaform
});

/**
 * Metaforms API provider
 */
const MetaformsApiProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectKeycloak);

  /**
   * Finds a metaform
   * 
   * @param request request
   */
  const findMetaform = async (request: FindMetaformRequest) => {
    try {
      if (!auth?.token) {
        throw new Error("No access token");
      }

      return await Api.getMetaformsApi(auth.token).findMetaform(request);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Component render
   */
  return (
    <MetaformsApiContext.Provider
      value={{ findMetaform: findMetaform }}
    >
      { children }
    </MetaformsApiContext.Provider>
  );
};

export default MetaformsApiProvider;