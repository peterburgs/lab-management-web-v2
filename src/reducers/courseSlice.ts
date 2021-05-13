import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Course } from "../types/model";
import { api, auth } from "../api";
import _ from "lodash";

interface CourseState {
  status: "idle" | "pending" | "succeeded" | "failed";
  courses: Course[];
  count: number;
  message?: string;
}

interface GETResponse {
  courses: Course[];
  count: number;
  message: string;
}

interface GETFilter {
  courseName?: string;
  numberOfCredits?: number;
}

interface POSTResponse {
  course: Course | null;
  message: string;
}

interface PUTResponse {
  course: Course | null;
  message: string;
}

interface DELETEResponse {
  course: Course | null;
  message: string;
}

export const getCourses = createAsyncThunk<
  GETResponse,
  GETFilter,
  { rejectValue: GETResponse }
>("courses/getCourses", async (filter, thunkApi) => {
  try {
    const { data } = await api.get("/courses", {
      headers: auth(),
      params: { ...filter },
    });
    return data as GETResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as GETResponse);
  }
});

export const newCourse = createAsyncThunk<
  POSTResponse,
  Course,
  { rejectValue: POSTResponse }
>("courses/newCourse", async (course, thunkApi) => {
  try {
    const { data } = await api.post("/courses", course, {
      headers: auth(),
    });
    return data as POSTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as POSTResponse
    );
  }
});

export const editCourse = createAsyncThunk<
  PUTResponse,
  Course,
  { rejectValue: PUTResponse }
>("courses/editCourse", async (course, thunkApi) => {
  try {
    const { data } = await api.put(`/courses/${course._id}`, course, {
      headers: auth(),
    });
    return data as PUTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as PUTResponse);
  }
});

export const deleteCourse = createAsyncThunk<
  DELETEResponse,
  string,
  { rejectValue: DELETEResponse }
>("courses/deleteCourse", async (courseId, thunkApi) => {
  try {
    const { data } = await api.delete(`/courses/${courseId}`, {
      headers: auth(),
    });
    return data as DELETEResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as DELETEResponse
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
  reducers: {
    resetState: (state) => {
      state.count = 0;
      state.message = "";
      state.courses = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCourses.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getCourses.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.courses = _.cloneDeep(action.payload.courses);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(getCourses.rejected, (state, action) => {
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
      state.courses = state.courses.concat(action.payload.course!);
      state.message = action.payload.message;
    });
    builder.addCase(editCourse.fulfilled, (state, action) => {
      const currentIndex = state.courses.findIndex(
        (item) => item._id === action.payload.course!._id
      );
      state.courses[currentIndex] = _.cloneDeep(
        action.payload.course!
      );
      state.message = action.payload.message;
    });
    builder.addCase(deleteCourse.fulfilled, (state, action) => {
      state.courses = state.courses.filter(
        (item) => item._id !== action.payload.course!._id
      );
      state.message = action.payload.message;
    });
  },
});

export const { resetState } = CourseSlice.actions;

export default CourseSlice.reducer;
