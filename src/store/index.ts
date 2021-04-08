import {
  configureStore,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import teachingReducer from "../reducers/teachingSlice";
import semesterReducer from "../reducers/semesterSlice";
import registrationReducer from "../reducers/registrationSlice";
import courseReducer from "../reducers/courseSlice";
import userReducer from "../reducers/userSlice";
import notificationReducer from "../reducers/notificationSlice";
import registrableCourseReducer from "../reducers/registrableCourseSlice";
import authReducer from "../reducers/authSlice";
import {
  useDispatch,
  useSelector,
  TypedUseSelectorHook,
} from "react-redux";

export const store = configureStore({
  reducer: {
    teachings: teachingReducer,
    registrations: registrationReducer,
    semester: semesterReducer,
    courses: courseReducer,
    users: userReducer,
    notifications: notificationReducer,
    registrableCourses: registrableCourseReducer,
    auth: authReducer,
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
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
