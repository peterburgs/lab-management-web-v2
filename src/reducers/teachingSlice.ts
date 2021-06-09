import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Teaching } from "../types/model";
import { nodeAPI, auth } from "../api";
import _ from "lodash";
import { RootState } from "../store";

interface TeachingState {
  status: "idle" | "pending" | "succeeded" | "failed";
  teachings: Teaching[];
  count: number;
  message?: string;
}

export interface GETResponse {
  teachings: Teaching[];
  count: number;
  message: string;
}

interface GETFilter {
  user?: string;
  registration?: string;
}

interface POSTResponse {
  teaching: Teaching | null;
  message: string;
}

interface PUTResponse {
  teaching: Teaching | null;
  message: string;
}

interface DELETEResponse {
  teaching: Teaching | null;
  message: string;
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
    const { data } = await nodeAPI.get("/teachings", {
      headers: auth(),
      params: { ...filter },
    });
    return data as GETResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as GETResponse);
  }
});

export const newTeaching = createAsyncThunk<
  POSTResponse,
  Teaching,
  { rejectValue: POSTResponse }
>("teachings/newTeaching", async (teaching, thunkApi) => {
  try {
    const { data } = await nodeAPI.post("/teachings", teaching, {
      headers: auth(),
    });
    return data as POSTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as POSTResponse
    );
  }
});

export const createBulkOfTeachings = createAsyncThunk<
  { teachings: Teaching[]; message: string },
  Teaching[],
  { rejectValue: { teachings: Teaching[]; message: string } }
>("teachings/createBulkOfTeachings", async (teachings, thunkApi) => {
  try {
    const { data } = await nodeAPI.post(
      "/teachings/bulk",
      { teachings: [...teachings] },
      {
        headers: auth(),
      }
    );
    return data as { teachings: Teaching[]; message: string };
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as { teachings: Teaching[]; message: string }
    );
  }
});

export const editTeaching = createAsyncThunk<
  PUTResponse,
  Teaching,
  { rejectValue: PUTResponse }
>("teachings/editTeaching", async (teaching, thunkApi) => {
  try {
    const { data } = await nodeAPI.put(
      `/teachings/${teaching._id}`,
      teaching,
      { headers: auth() }
    );
    return data as PUTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as PUTResponse);
  }
});

export const deleteTeaching = createAsyncThunk<
  DELETEResponse,
  string,
  { rejectValue: DELETEResponse }
>("teachings/deleteTeaching", async (teachingId, thunkApi) => {
  try {
    const { data } = await nodeAPI.delete(`/teachings/${teachingId}`, {
      headers: auth(),
    });
    return data as DELETEResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as DELETEResponse
    );
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
    builder.addCase(newTeaching.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.teachings = state.teachings.concat(
        action.payload.teaching!
      );
      state.message = action.payload.message;
    });
    builder.addCase(
      createBulkOfTeachings.fulfilled,
      (state, action) => {
        state.status = "succeeded";
        state.teachings = state.teachings.concat(
          action.payload.teachings
        );
        state.message = action.payload.message;
      }
    );
    builder.addCase(editTeaching.fulfilled, (state, action) => {
      const currentIndex = state.teachings.findIndex(
        (item) => item._id === action.payload.teaching!._id
      );
      state.teachings[currentIndex] = _.cloneDeep(
        action.payload.teaching!
      );
      state.message = action.payload.message;
    });
    builder.addCase(deleteTeaching.fulfilled, (state, action) => {
      state.teachings = state.teachings.filter(
        (item) => item._id !== action.payload.teaching!._id
      );
      state.message = action.payload.message;
    });
  },
});

export const { resetState } = teachingSlice.actions;

export default teachingSlice.reducer;
