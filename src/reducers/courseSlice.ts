import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Course } from "../react-app-env";
import { api } from "../api";
import _ from "lodash";

interface CourseState {
  status: "idle" | "pending" | "succeeded" | "failed";
  courses: Course[];
  count?: number;
  message?: string;
}

interface ResponseData {
  courses: Course[];
  count: number;
  message: string;
}

export const fetchAllCourses = createAsyncThunk<
  ResponseData,
  undefined,
  { rejectValue: ResponseData }
>("courses/fetchAllCourses", async (_, thunkApi) => {
  try {
    const { data } = await api.get("/courses");
    return data as ResponseData;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as ResponseData
    );
  }
});

export const newCourse = createAsyncThunk<
  ResponseData,
  Course,
  { rejectValue: ResponseData }
>("courses/newCourse", async (course, thunkApi) => {
  try {
    const { data } = await api.post("/courses", course);
    return data as ResponseData;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as ResponseData
    );
  }
});

const initialState = {
  status: "idle",
  courses: [],
} as CourseState;

export const CourseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllCourses.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(fetchAllCourses.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.courses = _.cloneDeep(action.payload.courses);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(fetchAllCourses.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) {
        state.message = action.payload.message;
        state.courses = [];
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
    builder.addCase(newCourse.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.courses = state.courses.concat(action.payload.courses);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
  },
});

export default CourseSlice.reducer;
