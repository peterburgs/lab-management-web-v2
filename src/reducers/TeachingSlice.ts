import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Teaching } from "../react-app-env";

export interface TeachingState {
  teachings: Teaching[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: unknown;
}

export const fetchTeachings = createAsyncThunk<Teaching[]>(
  "teachings/fetchTeachings",
  async () => {
    const response = await fetch("/api/teachings");
    const data = await response.json();
    return data.teachings as Teaching[];
  }
);

const initialState: TeachingState = {
  teachings: [],
  status: "idle",
  error: undefined,
};

export const teachingSlice = createSlice({
  name: "teachings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTeachings.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchTeachings.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.teachings = state.teachings.concat(action.payload);
    });
    builder.addCase(fetchTeachings.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export default teachingSlice.reducer;
