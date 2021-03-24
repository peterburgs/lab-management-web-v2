import {
  configureStore,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import registrationReducer from "../reducers/TeachingSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    teachings: registrationReducer,
  },
  devTools: process.env.NODE_ENV === "development",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
