import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Semester } from "../react-app-env";
import { api } from "../api";
import _ from "lodash";

interface SemesterState {
  status: "idle" | "pending" | "succeeded" | "failed";
  semester: Semester | null;
  count: number;
  message?: string;
}

interface GetResponseData {
  semester: Semester | null;
  count: number;
  message: string;
}

interface PostPutResponseData {
  semester: Semester | null;
  message: string;
}

export const fetchOpenSemester = createAsyncThunk<
  GetResponseData,
  undefined,
  { rejectValue: GetResponseData }
>("semester/fetchOpenSemester", async (_, thunkApi) => {
  try {
    const { data } = await api.get("/semester", {
      params: { isopening: true },
    });
    return data as GetResponseData;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as GetResponseData
    );
  }
});

export const startSemester = createAsyncThunk<
  PostPutResponseData,
  Semester,
  { rejectValue: PostPutResponseData }
>("semester/startSemester", async (semester, thunkApi) => {
  try {
    console.log(semester);
    const { data } = await api.post("/semester", semester);
    return data as PostPutResponseData;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as PostPutResponseData
    );
  }
});

export const editSemester = createAsyncThunk<
  PostPutResponseData,
  Semester,
  { rejectValue: PostPutResponseData }
>("semester/editSemester", async (semester, thunkApi) => {
  try {
    const { data } = await api.put(
      `/semester/${semester._id}`,
      semester
    );
    return data as PostPutResponseData;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as PostPutResponseData
    );
  }
});

const initialState: SemesterState = {
  status: "idle",
  semester: null,
  count: 0,
};

export const semesterSlice = createSlice({
  name: "semester",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOpenSemester.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(fetchOpenSemester.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.semester = _.cloneDeep(action.payload.semester);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(fetchOpenSemester.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) {
        state.semester = null;
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
    builder.addCase(startSemester.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.semester = _.cloneDeep(action.payload.semester);
      state.message = action.payload.message;
    });
    builder.addCase(editSemester.fulfilled, (state, action) => {
      if (action.payload.semester?.isOpening === false) {
        state.semester = null;
        state.count = 0;
        state.message = "";
        state.status = "idle";
      } else {
        state.status = "succeeded";
        state.semester = _.cloneDeep(action.payload.semester);
        state.message = action.payload.message;
      }
    });
  },
});

export default semesterSlice.reducer;
