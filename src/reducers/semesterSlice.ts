import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Semester } from "../types/model";
import { api } from "../api";
import _ from "lodash";

interface SemesterState {
  status: "idle" | "pending" | "succeeded" | "failed";
  semesters: Semester[];
  count: number;
  message?: string;
}

export interface GETResponse {
  semesters: Semester[];
  count: number;
  message: string;
}

interface GETFilter {
  semesterName?: string;
  startDate?: Date;
  numberOfWeeks?: number;
  isOpening?: boolean;
}

interface POSTResponse {
  semester: Semester | null;
  message: string;
}

interface PUTResponse {
  semester: Semester | null;
  message: string;
}

export const getSemesters = createAsyncThunk<
  GETResponse,
  GETFilter,
  { rejectValue: GETResponse }
>("semesters/getSemesters", async (filter, thunkApi) => {
  try {
    const { data } = await api.get("/semesters", {
      params: { ...filter },
    });
    return data as GETResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as GETResponse);
  }
});

export const startSemester = createAsyncThunk<
  POSTResponse,
  Semester,
  { rejectValue: POSTResponse }
>("semesters/startSemester", async (semester, thunkApi) => {
  try {
    console.log(semester);
    const { data } = await api.post("/semesters", semester);
    return data as POSTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as POSTResponse
    );
  }
});

export const editSemester = createAsyncThunk<
  PUTResponse,
  Semester,
  { rejectValue: PUTResponse }
>("semesters/editSemester", async (semester, thunkApi) => {
  try {
    const { data } = await api.put(
      `/semesters/${semester._id}`,
      semester
    );
    return data as PUTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as PUTResponse);
  }
});

const initialState: SemesterState = {
  status: "idle",
  semesters: [],
  count: 0,
};

export const semesterSlice = createSlice({
  name: "semester",
  initialState,
  reducers: {
    resetState: (state) => {
      state.count = 0;
      state.message = "";
      state.semesters = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSemesters.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(getSemesters.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.semesters = _.cloneDeep(action.payload.semesters);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(getSemesters.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) {
        state.semesters = [];
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
    builder.addCase(startSemester.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.semesters = state.semesters.concat(
        action.payload.semester!
      );
      state.message = action.payload.message;
    });
    builder.addCase(editSemester.fulfilled, (state, action) => {
      if (action.payload.semester?.isOpening === false) {
        state.semesters = [];
        state.count = 0;
        state.message = "";
        state.status = "idle";
      } else {
        const currentIndex = state.semesters.findIndex(
          (item) => item._id === action.payload.semester!._id
        );
        state.semesters[currentIndex] = _.cloneDeep(
          action.payload.semester!
        );
        state.message = action.payload.message;
      }
    });
  },
});

export const { resetState } = semesterSlice.actions;

export default semesterSlice.reducer;
