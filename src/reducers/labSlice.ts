import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Lab } from "../types/model";
import { nodeAPI, auth } from "../api";
import _ from "lodash";

interface LabState {
  status: "idle" | "pending" | "succeeded" | "failed";
  labs: Lab[];
  count: number;
  message?: string;
}

interface GETResponse {
  labs: Lab[];
  count: number;
  message: string;
}

interface GETFilter {
  labName?: string;
  capacity?: string;
}

interface POSTResponse {
  lab: Lab | null;
  message: string;
}

interface PUTResponse {
  lab: Lab | null;
  message: string;
}

interface DELETEResponse {
  lab: Lab | null;
  message: string;
}

export const getLabs = createAsyncThunk<
  GETResponse,
  GETFilter,
  { rejectValue: GETResponse }
>("labs/getLabs", async (filter, thunkApi) => {
  try {
    const { data } = await nodeAPI.get("/labs", {
      headers: auth(),
      params: { ...filter },
    });
    return data as GETResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as GETResponse);
  }
});

export const newLab = createAsyncThunk<
  POSTResponse,
  Lab,
  { rejectValue: POSTResponse }
>("labs/newLab", async (lab, thunkApi) => {
  try {
    const { data } = await nodeAPI.post("/labs", lab, {
      headers: auth(),
    });
    return data as POSTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as POSTResponse
    );
  }
});

export const createBulkOfLabs = createAsyncThunk<
  { labs: Lab[]; message: string },
  Lab[],
  { rejectValue: { labs: Lab[]; message: string } }
>("labs/createBulkOfLabs", async (labs, thunkApi) => {
  try {
    const { data } = await nodeAPI.post(
      "/labs/bulk",
      { labs: [...labs] },
      {
        headers: auth(),
      }
    );
    return data as { labs: Lab[]; message: string };
  } catch (err) {
    console.log(err.response);
    return thunkApi.rejectWithValue(
      err.response.data as { labs: Lab[]; message: string }
    );
  }
});

export const editLab = createAsyncThunk<
  PUTResponse,
  Lab,
  { rejectValue: PUTResponse }
>("labs/editLab", async (lab, thunkApi) => {
  try {
    const { data } = await nodeAPI.put(`/labs/${lab._id}`, lab, {
      headers: auth(),
    });
    return data as PUTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as PUTResponse);
  }
});

export const deleteLab = createAsyncThunk<
  DELETEResponse,
  string,
  { rejectValue: DELETEResponse }
>("labs/deleteLab", async (labId, thunkApi) => {
  try {
    const { data } = await nodeAPI.delete(`/labs/${labId}`, {
      headers: auth(),
    });
    return data as DELETEResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as DELETEResponse
    );
  }
});

const initialState = {
  status: "idle",
  labs: [],
  count: 0,
} as LabState;

export const LabSlice = createSlice({
  name: "labs",
  initialState,
  reducers: {
    resetState: (state) => {
      state.count = 0;
      state.message = "";
      state.labs = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLabs.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getLabs.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.labs = _.cloneDeep(action.payload.labs);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(getLabs.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) {
        state.message = action.payload.message;
        state.labs = [];
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
    builder.addCase(newLab.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.labs = state.labs.concat(action.payload.lab!);
      state.message = action.payload.message;
    });
    builder.addCase(editLab.fulfilled, (state, action) => {
      const currentIndex = state.labs.findIndex(
        (item) => item._id === action.payload.lab!._id
      );
      state.labs[currentIndex] = _.cloneDeep(action.payload.lab!);
      state.message = action.payload.message;
    });
    builder.addCase(deleteLab.fulfilled, (state, action) => {
      state.labs = state.labs.filter(
        (item) => item._id !== action.payload.lab!._id
      );
      state.message = action.payload.message;
    });
    builder.addCase(createBulkOfLabs.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.message = action.payload.message;
    });
  },
});

export const { resetState } = LabSlice.actions;

export default LabSlice.reducer;
