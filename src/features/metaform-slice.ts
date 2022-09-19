import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import { Metaform } from "generated/client";

interface MetaformState {
  metaform?: Metaform;
}

/**
 * Initial metaform state
 */
const initialState: MetaformState = {
  metaform: undefined
};

/**
 * Metaform slice of Redux store
 */
export const metaformSlice = createSlice({
  name: "metaform",
  initialState: initialState,
  reducers: {
    setMetaform: (state, { payload }: PayloadAction<Metaform | undefined>) => {
      state.metaform = payload;
    }
  }
});

/**
 * Metaform actions from created metaform slice
 */
export const { setMetaform } = metaformSlice.actions;

/**
 * Select metaform selector
 *
 * @param state Redux store root state
 * @returns metaform from Redux store
 */
export const selectMetaform = (state: RootState) => state.metaform;

/**
 * Reducer for metaform slice
 */
export default metaformSlice.reducer;