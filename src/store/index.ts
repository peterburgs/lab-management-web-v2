import {
  configureStore,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import teachingReducer from "../reducers/teachingSlice";
import semesterReducer from "../reducers/semesterSlice";
import registrationReducer from "../reducers/registrationSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    teachings: teachingReducer,
    registrations: registrationReducer,
    semester: semesterReducer,
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
