import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import strings from "localization/strings";

interface LocaleState {
  locale: string;
}

/**
 * Initial locale state
 */
const initialState: LocaleState = {
  locale: "fi"
};

/**
 * Locale slice of Redux store
 */
export const localeSlice = createSlice({
  name: "locale",
  initialState: initialState,
  reducers: {
    setLocale: (state, { payload }: PayloadAction<string>) => {
      strings.setLanguage(payload);
      state.locale = payload;
    }
  }
});

/**
 * Locale actions from created locale slice
 */
export const { setLocale } = localeSlice.actions;

/**
 * Select locale selector
 * 
 * @param state Redux store root state
 * @returns locale from Redux store
 */
export const selectLocale = (state: RootState) => state.locale;

/**
 * Reducer for locale slice
 */
export default localeSlice.reducer;