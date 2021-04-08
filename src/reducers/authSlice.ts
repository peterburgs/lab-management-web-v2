import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { User } from "../react-app-env";
import { api } from "../api";
import _ from "lodash";
import { AppDispatch } from "../store";

interface AuthState {
  status: "idle" | "pending" | "succeeded" | "failed";
  verifiedUser: User | null;
  verifiedRole: string | null;
  avatarUrl: string | null;
  verifiedToken: string | null;
  expirationDate: number | null;
  isSessionTimeout: boolean;
}

interface GetResponseData {
  verifiedUser: User;
  avatarUrl: string;
  verifiedToken: string;
  verifiedRole: string;
}

export const verify = createAsyncThunk<
  GetResponseData,
  {
    token: string;
    role: string;
    expirationDate: string;
  },
  { rejectValue: GetResponseData; dispatch: AppDispatch }
>(
  "auth/verify",
  async ({ token, role, expirationDate }, thunkApi) => {
    try {
      const { data } = await api.get("/auth", {
        params: { role: role },
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("exp", expirationDate);
      setTimeout(() => {
        thunkApi.dispatch(setIsSessionTimeout(true));
      }, new Date(Number(expirationDate)).getTime() - new Date().getTime());
      return data as GetResponseData;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data as GetResponseData
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
    refreshState: (state) => {
      state.verifiedUser = null;
      state.verifiedToken = null;
      state.verifiedRole = null;
      state.avatarUrl = null;
      state.isSessionTimeout = false;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("exp");
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
  refreshState,
} = AuthSlice.actions;

export default AuthSlice.reducer;
