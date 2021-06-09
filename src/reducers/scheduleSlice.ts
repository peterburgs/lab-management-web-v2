import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LabUsage } from "../types/model";
import { nodeAPI, auth } from "../api";
import _ from "lodash";

interface ScheduleState {
  scheduleStatus: "idle" | "pending" | "succeeded" | "failed";
  labUsageStatus: "idle" | "pending" | "succeeded" | "failed";
  labUsages: LabUsage[];
  count: number;
  message?: string;
}

export interface LabUsageGETResponse {
  labUsages: LabUsage[];
  count: number;
  message: string;
}

interface LabUsageGETFilter {
  semester?: string;
}

interface SchedulePOSTResponse {
  message: string;
}

interface LabUsagePUTResponse {
  labUsage: LabUsage;
  message: string;
}

interface LabUsagePOSTResponse {
  labUsage: LabUsage | null;
  message: string;
}

export const getLabUsages = createAsyncThunk<
  LabUsageGETResponse,
  LabUsageGETFilter,
  { rejectValue: LabUsageGETResponse }
>("schedule/getLabUsages", async (filter, thunkApi) => {
  try {
    const { data } = await nodeAPI.get("/schedules", {
      headers: auth(),
      params: { ...filter },
    });
    return data as LabUsageGETResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as LabUsageGETResponse
    );
  }
});

export const newLabUsage = createAsyncThunk<
  LabUsagePOSTResponse,
  LabUsage,
  { rejectValue: LabUsagePOSTResponse }
>("schedule/newLabUsage", async (labUsage, thunkApi) => {
  try {
    const { data } = await nodeAPI.post("/schedules", labUsage, {
      headers: auth(),
    });
    return data as LabUsagePOSTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as LabUsagePOSTResponse
    );
  }
});

export const editLabUsage = createAsyncThunk<
  LabUsagePUTResponse,
  LabUsage,
  { rejectValue: LabUsagePUTResponse }
>("schedule/editLabUsage", async (labUsage, thunkApi) => {
  try {
    const { data } = await nodeAPI.put(
      `/schedules/${labUsage._id}`,
      labUsage,
      { headers: auth() }
    );
    return data as LabUsagePUTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as LabUsagePUTResponse
    );
  }
});

export const generateSchedule = createAsyncThunk<
  SchedulePOSTResponse,
  { registration: string },
  { rejectValue: SchedulePOSTResponse }
>("schedule/generateSchedule", async ({ registration }, thunkApi) => {
  try {
    const { data } = await nodeAPI.post(
      "/schedules/generate",
      {
        registration,
      },
      { headers: auth() }
    );
    return data as SchedulePOSTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as SchedulePOSTResponse
    );
  }
});

const initialState: ScheduleState = {
  scheduleStatus: "idle",
  labUsageStatus: "idle",
  labUsages: [],
  count: 0,
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    resetState: (state) => {
      state.count = 0;
      state.message = "";
      state.labUsages = [];
      state.scheduleStatus = "idle";
      state.labUsageStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLabUsages.pending, (state, action) => {
      state.labUsageStatus = "pending";
    });
    builder.addCase(getLabUsages.fulfilled, (state, action) => {
      state.labUsageStatus = "succeeded";
      state.labUsages = _.cloneDeep(action.payload.labUsages);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(getLabUsages.rejected, (state, action) => {
      state.labUsageStatus = "failed";
      if (action.payload) {
        state.labUsages = [];
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
    builder.addCase(generateSchedule.fulfilled, (state, action) => {
      state.scheduleStatus = "succeeded";
      state.message = action.payload.message;
    });
    builder.addCase(newLabUsage.fulfilled, (state, action) => {
      state.labUsageStatus = "succeeded";
      state.labUsages = state.labUsages.concat(
        action.payload.labUsage!
      );
      state.message = action.payload.message;
    });
    builder.addCase(editLabUsage.fulfilled, (state, action) => {
      const currentIndex = state.labUsages.findIndex(
        (item) => item._id === action.payload.labUsage!._id
      );
      state.labUsages[currentIndex] = _.cloneDeep(
        action.payload.labUsage!
      );
      state.message = action.payload.message;
    });
  },
});

export const { resetState } = scheduleSlice.actions;

export default scheduleSlice.reducer;
