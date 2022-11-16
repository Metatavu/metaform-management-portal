import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import { MetaformVersion } from "generated/client";

interface MetaformState {
  metaformVersion?: MetaformVersion;
  metaformSectionIndex?: number;
  metaformFieldIndex?: number;
}

/**
 * Initial metaform state
 */
const initialState: MetaformState = {
  metaformVersion: undefined,
  metaformSectionIndex: undefined,
  metaformFieldIndex: undefined
};

/**
 * Metaform slice of Redux store
 */
export const metaformSlice = createSlice({
  name: "metaform",
  initialState: initialState,
  reducers: {
    setMetaformVersion: (state, { payload }: PayloadAction<MetaformVersion | undefined>) => {
      state.metaformVersion = payload;
    },
    setMetaformSectionIndex: (state, { payload }: PayloadAction<number | undefined>) => {
      state.metaformSectionIndex = payload;
    },
    setMetaformFieldIndex: (state, { payload }: PayloadAction<number | undefined>) => {
      state.metaformFieldIndex = payload;
    },
    setMetaformSelectionsUndefined: (state, { payload }: PayloadAction<undefined>) => {
      state.metaformSectionIndex = payload;
      state.metaformFieldIndex = payload;
    }
  }
});

/**
 * Metaform actions from created metaform slice
 */
export const {
  setMetaformVersion, setMetaformFieldIndex, setMetaformSectionIndex, setMetaformSelectionsUndefined
} = metaformSlice.actions;

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