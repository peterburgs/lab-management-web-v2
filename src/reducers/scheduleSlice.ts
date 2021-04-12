import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LabUsage } from "../react-app-env";
import { api } from "../api";
import _ from "lodash";

interface ScheduleState {
  status: "idle" | "pending" | "succeeded" | "failed";
  labUsages: LabUsage[];
  count: number;
  message?: string;
}

interface GETResponse {
  labUsages: LabUsage[];
  count: number;
  message: string;
}

interface GETFilter {
  semester?: string;
}

interface POSTResponse {
  message: string;
}

export const getLabUsages = createAsyncThunk<
  GETResponse,
  GETFilter,
  { rejectValue: GETResponse }
>("schedule/getLabUsages", async (filter, thunkApi) => {
  try {
    const { data } = await api.get("/schedule", {
      params: { ...filter },
    });
    return data as GETResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as GETResponse);
  }
});

export const generateSchedule = createAsyncThunk<
  POSTResponse,
  { registration: string; isNew: boolean },
  { rejectValue: POSTResponse }
>(
  "schedule/generateSchedule",
  async ({ registration, isNew }, thunkApi) => {
    try {
      const { data } = await api.post("/schedule", {
        registration,
        isNew,
      });
      return data as POSTResponse;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as POSTResponse
      );
    }
  }
);

const initialState: ScheduleState = {
  status: "idle",
  labUsages: [],
  count: 0,
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLabUsages.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(getLabUsages.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.labUsages = _.cloneDeep(action.payload.labUsages);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(getLabUsages.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) {
        state.labUsages = [];
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
    builder.addCase(generateSchedule.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.message = action.payload.message;
    });
  },
});

export default scheduleSlice.reducer;
