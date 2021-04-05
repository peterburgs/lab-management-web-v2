import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Teaching } from "../react-app-env";
import { api } from "../api";
import _ from "lodash";

interface TeachingState {
  status: "idle" | "pending" | "succeeded" | "failed";
  teachings: Teaching[];
  count?: number;
  message?: string;
}

interface ResponseData {
  teachings: Teaching[];
  count: number;
  message: string;
}

export const fetchAllTeachingsByRegistrationId = createAsyncThunk<
  ResponseData,
  string,
  { rejectValue: ResponseData }
>(
  "teachings/fetchAllTeachingsByRegistrationId",
  async (registrationId, thunkApi) => {
    try {
      const { data } = await api.get("/teachings", {
        params: { registrationid: registrationId },
      });
      return data as ResponseData;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as ResponseData
      );
    }
  }
);

const initialState: TeachingState = {
  teachings: [],
  status: "idle",
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
    builder.addCase(
      fetchAllTeachingsByRegistrationId.pending,
      (state, action) => {
        state.status = "pending";
      }
    );
    builder.addCase(
      fetchAllTeachingsByRegistrationId.fulfilled,
      (state, action) => {
        state.status = "succeeded";
        state.teachings = _.cloneDeep(action.payload.teachings);
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    );
    builder.addCase(
      fetchAllTeachingsByRegistrationId.rejected,
      (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.message = action.payload.message;
          state.teachings = [];
          state.count = action.payload.count;
          state.message = action.payload.message;
        }
      }
    );
  },
});

export const { resetState } = teachingSlice.actions;

export default teachingSlice.reducer;
