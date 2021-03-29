import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Semester } from "../react-app-env";

export interface SemesterState {
  semester: Semester | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: unknown;
}

export const fetchSemester = createAsyncThunk<Semester>(
  "semester/fetchSemester",
  async () => {
    const response = await fetch("/api/semester/open");
    const data = await response.json();
    return data.semester as Semester;
  }
);

const initialState: SemesterState = {
  semester: null,
  status: "idle",
  error: undefined,
};

export const semesterSlice = createSlice({
  name: "semester",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSemester.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchSemester.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.semester = action.payload;
    });
    builder.addCase(fetchSemester.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export default semesterSlice.reducer;
