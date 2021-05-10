import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ROLES, User } from "../types/react-app-env";
import { api } from "../api";
import _ from "lodash";
import { AppDispatch } from "../store";

interface AuthState {
  status: "idle" | "pending" | "succeeded" | "failed";
  verifiedUser: User | null;
  verifiedRole: ROLES | null;
  avatarUrl: string | null;
  verifiedToken: string | null;
  expirationDate: number | null;
  isSessionTimeout: boolean;
}

interface GETResponse {
  verifiedUser: User;
  avatarUrl: string;
  verifiedToken: string;
  verifiedRole: ROLES;
}

export const verify = createAsyncThunk<
  GETResponse,
  {
    token: string;
    role: ROLES;
    expirationDate: string;
  },
  { rejectValue: GETResponse; dispatch: AppDispatch }
>(
  "auth/verify",
  async ({ token, role, expirationDate }, thunkApi) => {
    try {
      const { data } = await api.get("/auth", {
        params: { role: role },
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("token", token);
      localStorage.setItem("role", role.toString());
      localStorage.setItem("exp", expirationDate);
      setTimeout(() => {
        thunkApi.dispatch(setIsSessionTimeout(true));
      }, new Date(Number(expirationDate)).getTime() - new Date().getTime());
      return data as GETResponse;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as GETResponse
      );
    }
  }
);

const initialState = {
  status: "idle",
  isSessionTimeout: false,
  verifiedToken: null,
  verifiedRole: null,
  avatarUrl: null,
  expirationDate: null,
} as AuthState;

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsSessionTimeout: (state, action: PayloadAction<boolean>) => {
      state.isSessionTimeout = action.payload;
    },
    resetState: (state) => {
      state.verifiedUser = null;
      state.verifiedToken = null;
      state.verifiedRole = null;
      state.avatarUrl = null;
      state.isSessionTimeout = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(verify.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(verify.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.verifiedUser = action.payload.verifiedUser;
      state.verifiedToken = action.payload.verifiedToken;
      state.verifiedRole = action.payload.verifiedRole;
      state.avatarUrl = action.payload.avatarUrl;
    });
    builder.addCase(verify.rejected, (state) => {
      state.status = "failed";
      state.verifiedUser = null;
      state.verifiedToken = null;
      state.verifiedRole = null;
      state.avatarUrl = null;
    });
  },
});

export const {
  setIsSessionTimeout,
  resetState,
} = AuthSlice.actions;

export default AuthSlice.reducer;
