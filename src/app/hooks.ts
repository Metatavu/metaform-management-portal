import React from "react";
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