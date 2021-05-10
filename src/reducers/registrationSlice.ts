import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Registration } from "../types/react-app-env";
import { api } from "../api";
import _ from "lodash";

interface RegistrationState {
  status: "idle" | "pending" | "succeeded" | "failed";
  registrations: Registration[];
  count: number;
  message?: string;
}

interface GETResponse {
  registrations: Registration[];
  count: number;
  message: string;
}

interface GETFilter {
  batch?: number;
  startDate?: Date;
  endDate?: Date;
  isOpening?: boolean;
  semester?: string;
}

interface POSTResponse {
  registration: Registration | null;
  message: string;
}

interface PUTResponse {
  registration: Registration | null;
  message: string;
}

export const getRegistrations = createAsyncThunk<
  GETResponse,
  GETFilter,
  { rejectValue: GETResponse }
>("registrations/getRegistrations", async (filter, thunkApi) => {
  try {
    const { data } = await api.get("/registrations", {
      params: { ...filter },
    });
    return data as GETResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as GETResponse);
  }
});

export const openRegistration = createAsyncThunk<
  POSTResponse,
  Registration,
  { rejectValue: POSTResponse }
>(
  "registrations/openRegistration",
  async (registration, thunkApi) => {
    try {
      const { data } = await api.post("/registrations", registration);
      return data as POSTResponse;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as POSTResponse
      );
    }
  }
);

export const editRegistration = createAsyncThunk<
  PUTResponse,
  Registration,
  { rejectValue: PUTResponse }
>(
  "registrations/editRegistration",
  async (registration, thunkApi) => {
    try {
      const { data } = await api.put(
        `/registrations/${registration._id}`,
        registration
      );
      return data as PUTResponse;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as PUTResponse
      );
    }
  }
);

const initialState = {
  status: "idle",
  registrations: [],
  count: 0,
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
    builder.addCase(getRegistrations.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getRegistrations.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.registrations = _.cloneDeep(action.payload.registrations);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(getRegistrations.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) {
        state.message = action.payload.message;
        state.registrations = [];
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
    builder.addCase(openRegistration.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.registrations = state.registrations.concat(
        action.payload.registration!
      );
      state.count = state.count + 1;
      state.message = action.payload.message;
    });
    builder.addCase(editRegistration.fulfilled, (state, action) => {
      const currentIndex = state.registrations.findIndex(
        (reg) => reg._id === action.payload.registration!._id
      );
      state.registrations[currentIndex] = _.cloneDeep(
        action.payload.registration!
      );
      state.message = action.payload.message;
    });
  },
});

export const { resetState } = registrationSlice.actions;

export default registrationSlice.reducer;
