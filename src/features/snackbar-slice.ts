import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";

/**
 * Interface for snackbar state
 */
interface SnackbarState {
  snackbarMessage?: string;
  snackbarOpen: boolean;
}

/**
 * Initial snackbar state
 */
const initialState: SnackbarState = {
  snackbarMessage: undefined,
  snackbarOpen: false
};

/**
 * snackbar slice of Redux store
 */
export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: initialState,
  reducers: {
    setSnackbarMessage: (state, { payload }: PayloadAction<string | undefined>) => {
      state.snackbarMessage = payload;
    },
    setSnackbarOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.snackbarOpen = payload;
    },
    handleSnackbarClose: state => {
      state.snackbarMessage = initialState.snackbarMessage;
      state.snackbarOpen = initialState.snackbarOpen;
    }
  }
});

/**
 * snackbar actions from created snackbar slice
 */
export const { setSnackbarMessage, setSnackbarOpen, handleSnackbarClose } = snackbarSlice.actions;

/**
 * Select snackbar selector
 * 
 * @param state Redux store root state
 * @returns snackbar from Redux store
 */
export const selectSnackbar = (state: RootState) => {
  const { snackbar } = state;
  
  return {
    snackbarMessage: snackbar.snackbarMessage,
    snackbarOpen: snackbar.snackbarOpen
  };
};

/**
 * Reducer for snackbar slice
 */
export default snackbarSlice.reducer;