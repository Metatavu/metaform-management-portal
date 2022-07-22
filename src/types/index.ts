import { Attachment, CreateDraftRequest, CreateReplyRequest, DeleteReplyRequest, Draft, FindAttachmentRequest, FindDraftRequest, FindMetaformRequest, FindReplyRequest, Metaform, Reply, UpdateDraftRequest, UpdateReplyRequest } from "generated/client";

/**
 * Application configuration
 */
export interface Configuration {
  auth: {
    url: string;
    realm: string;
    clientId: string;
  };
  anonymousUser: {
    username: string;
    password: string;
  };
  api: {
    baseUrl: string;
  };
}

/**
 * Interface describing an access token
 */
export interface AccessToken {
  created: Date;
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_expires_in?: number;
  firstName?: string;
  lastName?: string;
  userId?: string;
  realmRoles: string[];
}

/**
 * Error context type
 */
export type ErrorContextType = {
  error?: string;
  setError: (message: string, error?: any) => void;
};

/**
 * Confirm context type
 */
export type ConfirmContextType = {
  confirm: (operation: () => any, options: ConfirmOptions) => void;
  operation?: () => void | Promise<void>;
};

/**
 * Confirm options
 */
export type ConfirmOptions = {
  description?: string;
  onCancel?: () => any;
  onConfirm?: () => any;
  title: string;
};

/**
 * List item data
 */
export type ListItemData = {
  title: string;
  description: string;
};

/**
 * React dnd dragging mode
 */
export enum DraggingMode {
  FIELD = "FIELD",
  ADD_FIELD = "ADD_FIELD",
  SECTION = "SECTION"
}

/**
 * Enum navigation links
 */
export enum NavigationLinks {
  FORMS = "FORMS",
  USERS = "USERS",
  EDITOR = "EDITOR"
}

/**
 * Interface describing dictionary type
 */
export interface Dictionary<T> {
  [Key: string]: T;
}

/**
 * Metaforms API context type
 */
export interface MetaformsApiContextType {
  findMetaform: (request: FindMetaformRequest) => Promise<Metaform>
}

/**
 * Attachments API context type
 */
export interface AttachmentsApiContextType {
  findAttachment: (request: FindAttachmentRequest) => Promise<Attachment>
}

/**
 * Attachments API context type
 */
export interface DraftsApiContextType {
  findDraft: (request: FindDraftRequest) => Promise<Draft>,
  createDraft: (request: CreateDraftRequest) => Promise<Draft>,
  updateDraft: (request: UpdateDraftRequest) => Promise<Draft>
}

/**
 * Replies API context type
 */
export interface RepliesApiContextType {
  findReply: (request: FindReplyRequest) => Promise<Reply>,
  deleteReply: (request: DeleteReplyRequest) => Promise<void>,
  createReply: (request: CreateReplyRequest) => Promise<Reply>,
  updateReply: (request: UpdateReplyRequest) => Promise<void>
}