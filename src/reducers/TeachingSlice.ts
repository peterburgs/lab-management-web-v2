import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Teaching } from "../react-app-env";
import { api } from "../api";
import _ from "lodash";
import { RootState } from "../store";

interface TeachingState {
  status: "idle" | "pending" | "succeeded" | "failed";
  teachings: Teaching[];
  count: number;
  message?: string;
}

interface GETResponse {
  teachings: Teaching[];
  count: number;
  message: string;
}

interface GETFilter {
  user?: string;
  registration?: string;
}

export const getTeachings = createAsyncThunk<
  GETResponse,
  GETFilter,
  {
    rejectValue: GETResponse;
    state: RootState;
  }
>("teachings/getTeachings", async (filter, thunkApi) => {
  try {
    const { data } = await api.get("/teachings", {
      params: { ...filter },
    });
    return data as GETResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as GETResponse);
  }
});

const initialState: TeachingState = {
  teachings: [],
  status: "idle",
  count: 0,
};

export const teachingSlice = createSlice({
  name: "teachings",
  initialState,
  reducers: {
    resetState: (state) => {
      state.count = 0;
      state.message = "";
      state.teachings = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTeachings.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(getTeachings.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.teachings = _.cloneDeep(action.payload.teachings);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(getTeachings.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) {
        state.message = action.payload.message;
        state.teachings = [];
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
  },
});

export const { resetState } = teachingSlice.actions;

export default teachingSlice.reducer;
