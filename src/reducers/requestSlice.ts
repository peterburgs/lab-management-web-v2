import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Request } from "../types/model";
import { nodeAPI, auth } from "../api";
import _ from "lodash";

interface RequestState {
  status: "idle" | "pending" | "succeeded" | "failed";
  requests: Request[];
  count: number;
  message?: string;
}

interface GETResponse {
  requests: Request[];
  count: number;
  message: string;
}

interface GETFilter {
  user?: string;
}

interface POSTResponse {
  request: Request | null;
  message: string;
}

interface PUTResponse {
  request: Request | null;
  message: string;
}

export const getRequests = createAsyncThunk<
  GETResponse,
  GETFilter,
  { rejectValue: GETResponse }
>("requests/getRequests", async (filter, thunkApi) => {
  try {
    const { data } = await nodeAPI.get("/requests", {
      headers: auth(),
      params: { ...filter },
    });
    return data as GETResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as GETResponse);
  }
});

export const newRequest = createAsyncThunk<
  POSTResponse,
  Request,
  { rejectValue: POSTResponse }
>("requests/newRequest", async (request, thunkApi) => {
  try {
    const { data } = await nodeAPI.post("/requests", request, {
      headers: auth(),
    });
    return data as POSTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as POSTResponse
    );
  }
});

export const editRequest = createAsyncThunk<
  PUTResponse,
  Request,
  { rejectValue: PUTResponse }
>("requests/editRequest", async (request, thunkApi) => {
  try {
    const { data } = await nodeAPI.put(
      `/requests/${request._id}`,
      request,
      { headers: auth() }
    );
    return data as PUTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as PUTResponse);
  }
});

const initialState = {
  status: "idle",
  requests: [],
  count: 0,
} as RequestState;

export const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    resetState: (state) => {
      state.count = 0;
      state.message = "";
      state.requests = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRequests.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getRequests.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.requests = _.cloneDeep(action.payload.requests);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(getRequests.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) {
        state.message = action.payload.message;
        state.requests = [];
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
    builder.addCase(newRequest.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.requests = state.requests.concat(action.payload.request!);
      state.count = state.count + 1;
      state.message = action.payload.message;
    });
    builder.addCase(editRequest.fulfilled, (state, action) => {
      const currentIndex = state.requests.findIndex(
        (reg) => reg._id === action.payload.request!._id
      );
      state.requests[currentIndex] = _.cloneDeep(
        action.payload.request!
      );
      state.message = action.payload.message;
    });
  },
});

export const { resetState } = requestSlice.actions;

export default requestSlice.reducer;
