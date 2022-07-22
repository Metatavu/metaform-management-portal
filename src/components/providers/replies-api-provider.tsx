/* eslint-disable react/jsx-no-constructed-context-values */
import Api from "api";
import { useAppSelector } from "app/hooks";
import { selectKeycloak } from "features/auth-slice";
import { CreateReplyRequest, DeleteReplyRequest, FindReplyRequest, UpdateReplyRequest } from "generated/client";
import React from "react";
import { RepliesApiContextType } from "types";

const initialReply = {};

export const RepliesApiContext = React.createContext<RepliesApiContextType>({
  findReply: async () => initialReply,
  deleteReply: async () => {},
  createReply: async () => initialReply,
  updateReply: async () => {}
});

/**
 * Replies API provider
 */
const RepliesApiProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectKeycloak);

  /**
   * Finds a reply
   * 
   * @param request request
   */
  const findReply = async (request: FindReplyRequest) => {
    try {
      if (!auth?.token) {
        throw new Error("No access token");
      }

      return await Api.getRepliesApi(auth.token).findReply(request);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Finds a reply
   * 
   * @param request request
   */
  const deleteReply = async (request: DeleteReplyRequest) => {
    try {
      if (!auth?.token) {
        throw new Error("No access token");
      }

      return await Api.getRepliesApi(auth.token).deleteReply(request);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Create a reply
   * 
   * @param request request
   */
  const createReply = async (request: CreateReplyRequest) => {
    try {
      if (!auth?.token) {
        throw new Error("No access token");
      }

      return await Api.getRepliesApi(auth.token).createReply(request);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Create a reply
   * 
   * @param request request
   */
  const updateReply = async (request: UpdateReplyRequest) => {
    try {
      if (!auth?.token) {
        throw new Error("No access token");
      }

      return await Api.getRepliesApi(auth.token).updateReply(request);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Component render
   */
  return (
    <RepliesApiContext.Provider
      value={{
        findReply: findReply,
        deleteReply: deleteReply,
        createReply: createReply,
        updateReply: updateReply
      }}
    >
      { children }
    </RepliesApiContext.Provider>
  );
};

export default RepliesApiProvider;