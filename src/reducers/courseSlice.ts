import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Course } from "../react-app-env";
import { api } from "../api";
import _ from "lodash";

interface CourseState {
  status: "idle" | "pending" | "succeeded" | "failed";
  courses: Course[];
  count: number;
  message?: string;
}

interface GetResponseData {
  courses: Course[];
  count: number;
  message: string;
}

interface PostPutResponseData {
  course: Course;
  message: string;
}

export const fetchAllCourses = createAsyncThunk<
  GetResponseData,
  undefined,
  { rejectValue: GetResponseData }
>("courses/fetchAllCourses", async (_, thunkApi) => {
  try {
    const { data } = await api.get("/courses");
    return data as GetResponseData;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as GetResponseData
    );
  }
});

export const newCourse = createAsyncThunk<
  PostPutResponseData,
  Course,
  { rejectValue: PostPutResponseData }
>("courses/newCourse", async (course, thunkApi) => {
  try {
    const { data } = await api.post("/courses", course);
    return data as PostPutResponseData;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as PostPutResponseData
    );
  }
});

const initialState = {
  status: "idle",
  courses: [],
  count: 0,
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
      state.courses = state.courses.concat(action.payload.course);
      state.message = action.payload.message;
    });
  },
});

export default CourseSlice.reducer;
