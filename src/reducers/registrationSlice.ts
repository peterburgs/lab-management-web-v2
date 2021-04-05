import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Registration } from "../react-app-env";
import { api } from "../api";
import _ from "lodash";

interface RegistrationState {
  status: "idle" | "pending" | "succeeded" | "failed";
  registrations: Registration[];
  count?: number;
  message?: string;
}

interface ResponseData {
  registrations: Registration[];
  count: number;
  message: string;
}

export const fetchAllRegistrationsBySemesterId = createAsyncThunk<
  ResponseData,
  string,
  { rejectValue: ResponseData }
>(
  "registrations/fetchAllRegistrationsBySemesterId",
  async (semesterId, thunkApi) => {
    try {
      const { data } = await api.get("/registrations", {
        params: { semesterid: semesterId },
      });
      return data as ResponseData;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as ResponseData
      );
    }
  }
);

export const openRegistration = createAsyncThunk<
  ResponseData,
  Registration,
  { rejectValue: ResponseData }
>(
  "registrations/openRegistration",
  async (registration, thunkApi) => {
    try {
      const { data } = await api.post("/registrations", registration);
      return data as ResponseData;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as ResponseData
      );
    }
  }
);

const initialState = {
  status: "idle",
  registrations: [],
} as RegistrationState;

export const registrationSlice = createSlice({
  name: "registrations",
  initialState,
  reducers: {
    resetState: (state) => {
      state.count = 0;
      state.message = "";
      state.registrations = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAllRegistrationsBySemesterId.pending,
      (state) => {
        state.status = "pending";
      }
    );
    builder.addCase(
      fetchAllRegistrationsBySemesterId.fulfilled,
      (state, action) => {
        state.status = "succeeded";
        state.registrations = _.cloneDeep(
          action.payload.registrations
        );
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    );
    builder.addCase(
      fetchAllRegistrationsBySemesterId.rejected,
      (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.message = action.payload.message;
          state.registrations = [];
          state.count = action.payload.count;
          state.message = action.payload.message;
        }
      }
    );
    builder.addCase(openRegistration.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.registrations = state.registrations.concat(
        action.payload.registrations
      );
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
  },
});

export const { resetState } = registrationSlice.actions;

export default registrationSlice.reducer;
