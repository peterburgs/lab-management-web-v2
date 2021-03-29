import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Registration } from "../react-app-env";

export interface RegistrationState {
  registrations: Registration[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: unknown;
}

export const fetchAllRegistrationsBySemesterId = createAsyncThunk<
  Registration[],
  string
>(
  "registrations/fetchAllRegistrationsBySemesterId",
  async (semesterId) => {
    const response = await fetch(`/api/registrations/${semesterId}`);
    const data = await response.json();
    return data.registrations as Registration[];
  }
);

const initialState: RegistrationState = {
  registrations: [],
  status: "idle",
  error: undefined,
};

export const registrationSlice = createSlice({
  name: "registrations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchAllRegistrationsBySemesterId.pending,
      (state, action) => {
        state.status = "loading";
      }
    );
    builder.addCase(
      fetchAllRegistrationsBySemesterId.fulfilled,
      (state, action) => {
        state.status = "succeeded";
        state.registrations = action.payload;
      }
    );
    builder.addCase(
      fetchAllRegistrationsBySemesterId.rejected,
      (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }
    );
  },
});

export default registrationSlice.reducer;
