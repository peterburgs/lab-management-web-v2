import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RegistrableCourse } from "../types/model";
import { api } from "../api";
import _ from "lodash";

interface RegistrableCourseState {
  status: "idle" | "pending" | "succeeded" | "failed";
  registrableCourses: RegistrableCourse[];
  count?: number;
  message?: string;
}

interface GETResponse {
  registrableCourses: RegistrableCourse[];
  count: number;
  message: string;
}

interface GETFilter {
  registration?: string;
  course?: string;
}

interface POSTResponse {
  registrableCourse: RegistrableCourse | null;
  message: string;
}

export const getRegistrableCourses = createAsyncThunk<
  GETResponse,
  GETFilter,
  { rejectValue: GETResponse }
>(
  "registrableCourses/getRegistrableCourses",
  async (filter, thunkApi) => {
    try {
      const { data } = await api.get("/registrable-courses", {
        params: { ...filter },
      });
      return data as GETResponse;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as GETResponse
      );
    }
  }
);

export const newRegistrableCourse = createAsyncThunk<
  POSTResponse,
  RegistrableCourse,
  { rejectValue: POSTResponse }
>(
  "registrableCourses/newRegistrableCourse",
  async (registrableCourse, thunkApi) => {
    try {
      const { data } = await api.post(
        "/registrable-courses",
        registrableCourse
      );
      return data as POSTResponse;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as POSTResponse
      );
    }
  }
);

export const createBulkOfRegistrableCourses = createAsyncThunk<
  { registrableCourses: RegistrableCourse[]; message: string },
  RegistrableCourse[],
  {
    rejectValue: {
      registrableCourses: RegistrableCourse[];
      message: string;
    };
  }
>(
  "registrableCourses/createBulkOfRegistrableCourses",
  async (registrableCourses, thunkApi) => {
    try {
      const { data } = await api.post(
        "/registrable-courses/bulk",
        registrableCourses
      );
      return data as {
        registrableCourses: RegistrableCourse[];
        message: string;
      };
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as {
          registrableCourses: RegistrableCourse[];
          message: string;
        }
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
    builder.addCase(getRegistrableCourses.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(
      getRegistrableCourses.fulfilled,
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
      getRegistrableCourses.rejected,
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
          action.payload.registrableCourse!
        );
        state.message = action.payload.message;
      }
    );
    builder.addCase(
      createBulkOfRegistrableCourses.fulfilled,
      (state, action) => {
        state.status = "succeeded";
        state.registrableCourses = state.registrableCourses.concat(
          action.payload.registrableCourses
        );
        state.message = action.payload.message;
      }
    );
  },
});

export default RegistrableCourseSlice.reducer;
