import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../react-app-env";
import { api } from "../api";
import _ from "lodash";

interface UserState {
  status: "idle" | "pending" | "succeeded" | "failed";
  users: User[];
  count?: number;
  message?: string;
}

interface ResponseData {
  users: User[];
  count: number;
  message: string;
}

export const fetchAllUsers = createAsyncThunk<
  ResponseData,
  undefined,
  { rejectValue: ResponseData }
>("users/fetchAllUsers", async (_, thunkApi) => {
  try {
    const { data } = await api.get("/users");
    return data as ResponseData;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as ResponseData
    );
  }
});

const initialState = {
  status: "idle",
  users: [],
} as UserState;

export const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllUsers.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.users = _.cloneDeep(action.payload.users);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) {
        state.message = action.payload.message;
        state.users = [];
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
  },
});

export default UserSlice.reducer;
