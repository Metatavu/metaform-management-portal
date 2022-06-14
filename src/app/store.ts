import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth-slice";

/**
 * Initialized Redux store
 */
export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});

/**
 * Type of root state of Redux store
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type of dispatch method for dispatching actions to Redux store
 */
export type AppDispatch = typeof store.dispatch;