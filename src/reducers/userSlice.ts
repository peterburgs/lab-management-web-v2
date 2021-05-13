import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../types/model";
import { api, auth } from "../api";
import _ from "lodash";

interface UserState {
  status: "idle" | "pending" | "succeeded" | "failed";
  users: User[];
  count: number;
  message?: string;
}

interface GETResponse {
  users: User[];
  count: number;
  message: string;
}

interface GETFilter {
  email?: string;
  fullName?: string;
  roles?: string[];
}

interface POSTResponse {
  user: User | null;
  message: string;
}

interface PUTResponse {
  user: User | null;
  message: string;
}

interface DELETEResponse {
  user: User | null;
  message: string;
}

export const getUsers = createAsyncThunk<
  GETResponse,
  GETFilter,
  { rejectValue: GETResponse }
>("users/getUsers", async (filter, thunkApi) => {
  try {
    const { data } = await api.get("/users", {
      headers: auth(),
      params: { ...filter },
    });
    return data as GETResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as GETResponse);
  }
});

export const newUser = createAsyncThunk<
  POSTResponse,
  User,
  { rejectValue: POSTResponse }
>("users/newUser", async (user, thunkApi) => {
  try {
    const { data } = await api.post("/users", user, {
      headers: auth(),
    });
    return data as POSTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as POSTResponse
    );
  }
});

export const editUser = createAsyncThunk<
  PUTResponse,
  User,
  { rejectValue: PUTResponse }
>("users/editUser", async (user, thunkApi) => {
  try {
    const { data } = await api.put(`/users/${user._id}`, user, {
      headers: auth(),
    });
    return data as PUTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as PUTResponse);
  }
});

export const deleteUser = createAsyncThunk<
  DELETEResponse,
  string,
  { rejectValue: DELETEResponse }
>("users/deleteUser", async (userId, thunkApi) => {
  try {
    const { data } = await api.delete(`/users/${userId}`, {
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
  users: [],
  count: 0,
} as UserState;

export const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetState: (state) => {
      state.count = 0;
      state.message = "";
      state.users = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.users = _.cloneDeep(action.payload.users);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) {
        state.message = action.payload.message;
        state.users = [];
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
    builder.addCase(newUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.users = state.users.concat(action.payload.user!);
      state.message = action.payload.message;
    });
    builder.addCase(editUser.fulfilled, (state, action) => {
      const currentIndex = state.users.findIndex(
        (item) => item._id === action.payload.user!._id
      );
      state.users[currentIndex] = _.cloneDeep(action.payload.user!);
      state.message = action.payload.message;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter(
        (item) => item._id !== action.payload.user!._id
      );
      state.message = action.payload.message;
    });
  },
});

export const { resetState } = UserSlice.actions;

export default UserSlice.reducer;
