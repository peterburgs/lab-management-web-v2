import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AcademicYear } from "../types/model";
import { nodeAPI, auth } from "../api";
import _ from "lodash";

interface AcademicYearState {
  status: "idle" | "pending" | "succeeded" | "failed";
  academicYears: AcademicYear[];
  count: number;
  message?: string;
}

export interface GETResponse {
  academicYears: AcademicYear[];
  count: number;
  message: string;
}

interface GETFilter {
  isOpening?: boolean;
}

interface POSTResponse {
  academicYear: AcademicYear | null;
  message: string;
}

interface PUTResponse {
  academicYear: AcademicYear | null;
  message: string;
}

export const getAcademicYears = createAsyncThunk<
  GETResponse,
  GETFilter,
  { rejectValue: GETResponse }
>("academicYears/getAcademicYears", async (filter, thunkApi) => {
  try {
    const { data } = await nodeAPI.get("/academic-years", {
      headers: auth(),
      params: { ...filter },
    });
    return data as GETResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as GETResponse);
  }
});

export const startAcademicYear = createAsyncThunk<
  POSTResponse,
  AcademicYear,
  { rejectValue: POSTResponse }
>(
  "academicYears/startAcademicYear",
  async (academicYear, thunkApi) => {
    try {
      const { data } = await nodeAPI.post(
        "/academic-years",
        academicYear,
        {
          headers: auth(),
        }
      );
      return data as POSTResponse;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as POSTResponse
      );
    }
  }
);

export const editAcademicYear = createAsyncThunk<
  PUTResponse,
  AcademicYear,
  { rejectValue: PUTResponse }
>(
  "academicYears/editAcademicYear",
  async (academicYear, thunkApi) => {
    try {
      const { data } = await nodeAPI.put(
        `/academic-years/${academicYear._id}`,
        academicYear,
        { headers: auth() }
      );
      return data as PUTResponse;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as PUTResponse
      );
    }
  }
);

const initialState: AcademicYearState = {
  status: "idle",
  academicYears: [],
  count: 0,
};

export const academicYearSlice = createSlice({
  name: "academicYear",
  initialState,
  reducers: {
    resetState: (state) => {
      state.count = 0;
      state.message = "";
      state.academicYears = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAcademicYears.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(getAcademicYears.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.academicYears = _.cloneDeep(action.payload.academicYears);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(getAcademicYears.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) {
        state.academicYears = [];
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
    builder.addCase(startAcademicYear.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.academicYears = state.academicYears.concat(
        action.payload.academicYear!
      );
      state.message = action.payload.message;
    });
    builder.addCase(editAcademicYear.fulfilled, (state, action) => {
      const currentIndex = state.academicYears.findIndex(
        (item) => item._id === action.payload.academicYear!._id
      );
      state.academicYears[currentIndex] = _.cloneDeep(
        action.payload.academicYear!
      );
      state.message = action.payload.message;
    });
  },
});

export const { resetState } = academicYearSlice.actions;

export default academicYearSlice.reducer;
