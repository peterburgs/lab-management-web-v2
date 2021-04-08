import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RegistrableCourse } from "../react-app-env";
import { api } from "../api";
import _ from "lodash";

interface RegistrableCourseState {
  status: "idle" | "pending" | "succeeded" | "failed";
  registrableCourses: RegistrableCourse[];
  count?: number;
  message?: string;
}

interface GetResponseData {
  registrableCourses: RegistrableCourse[];
  count: number;
  message: string;
}

interface PostPutResponseData {
  registrableCourse: RegistrableCourse;
  message: string;
}

export const fetchAllRegistrableCoursesByRegistrationId = createAsyncThunk<
  GetResponseData,
  string,
  { rejectValue: GetResponseData }
>(
  "registrableCourses/fetchAllRegistrableCoursesByRegistrationId",
  async (registrationId, thunkApi) => {
    try {
      const { data } = await api.get("/registrableCourses", {
        params: { registrationid: registrationId },
      });
      return data as GetResponseData;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as GetResponseData
      );
    }
  }
);

export const newRegistrableCourse = createAsyncThunk<
  PostPutResponseData,
  RegistrableCourse,
  { rejectValue: PostPutResponseData }
>(
  "registrableCourses/newRegistrableCourse",
  async (registrableCourse, thunkApi) => {
    try {
      const { data } = await api.post(
        "/registrable-courses",
        registrableCourse
      );
      return data as PostPutResponseData;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as PostPutResponseData
      );
    }
  }
);

const initialState = {
  status: "idle",
  registrableCourses: [],
} as RegistrableCourseState;

export const RegistrableCourseSlice = createSlice({
  name: "registrableCourses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchAllRegistrableCoursesByRegistrationId.pending,
      (state) => {
        state.status = "pending";
      }
    );
    builder.addCase(
      fetchAllRegistrableCoursesByRegistrationId.fulfilled,
      (state, action) => {
        state.status = "succeeded";
        state.registrableCourses = _.cloneDeep(
          action.payload.registrableCourses
        );
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    );
    builder.addCase(
      fetchAllRegistrableCoursesByRegistrationId.rejected,
      (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.message = action.payload.message;
          state.registrableCourses = [];
          state.count = action.payload.count;
          state.message = action.payload.message;
        }
      }
    );
    builder.addCase(
      newRegistrableCourse.fulfilled,
      (state, action) => {
        state.status = "succeeded";
        state.registrableCourses = state.registrableCourses.concat(
          action.payload.registrableCourse
        );
        state.message = action.payload.message;
      }
    );
  },
});

export default RegistrableCourseSlice.reducer;
