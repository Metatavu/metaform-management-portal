/* eslint-disable react/jsx-no-constructed-context-values */
import Api from "api";
import { useAppSelector } from "app/hooks";
import { selectKeycloak } from "features/auth-slice";
import { CreateDraftRequest, FindDraftRequest, UpdateDraftRequest } from "generated/client";
import React from "react";
import { DraftsApiContextType } from "types";

const initialDraft = {
  data: {}
};

export const DraftsApiContext = React.createContext<DraftsApiContextType>({
  findDraft: async () => initialDraft,
  createDraft: async () => initialDraft,
  updateDraft: async () => initialDraft
});

/**
 * Drafts API provider
 */
const DraftsApiProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectKeycloak);

  /**
   * Finds an draft
   * 
   * @param request request
   */
  const findDraft = async (request: FindDraftRequest) => {
    try {
      if (!auth?.token) {
        throw new Error("No access token");
      }

      return await Api.getDraftsApi(auth.token).findDraft(request);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Create a draft
   * 
   * @param request request
   */
  const createDraft = async (request: CreateDraftRequest) => {
    try {
      if (!auth?.token) {
        throw new Error("No access token");
      }

      return await Api.getDraftsApi(auth.token).createDraft(request);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Create a draft
   * 
   * @param request request
   */
  const updateDraft = async (request: UpdateDraftRequest) => {
    try {
      if (!auth?.token) {
        throw new Error("No access token");
      }

      return await Api.getDraftsApi(auth.token).updateDraft(request);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Component render
   */
  return (
    <DraftsApiContext.Provider
      value={{
        findDraft: findDraft,
        createDraft: createDraft,
        updateDraft: updateDraft
      }}
    >
      { children }
    </DraftsApiContext.Provider>
  );
};

export default DraftsApiProvider;