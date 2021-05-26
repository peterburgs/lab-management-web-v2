import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Comment } from "../types/model";
import { api, auth } from "../api";
import _ from "lodash";

interface CommentState {
  status: "idle" | "pending" | "succeeded" | "failed";
  comments: Comment[];
  count: number;
  message?: string;
}

export interface GETResponse {
  comments: Comment[];
  count: number;
  message: string;
}

interface GETFilter {
  request: string;
}

interface POSTResponse {
  comment: Comment | null;
  message: string;
}

interface PUTResponse {
  comment: Comment | null;
  message: string;
}

export const getComments = createAsyncThunk<
  GETResponse,
  GETFilter,
  { rejectValue: GETResponse }
>("comments/getComments", async (filter, thunkApi) => {
  try {
    const { data } = await api.get("/comments", {
      headers: auth(),
      params: { ...filter },
    });
    return data as GETResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as GETResponse);
  }
});

export const newComment = createAsyncThunk<
  POSTResponse,
  Comment,
  { rejectValue: POSTResponse }
>("comments/newComment", async (comment, thunkApi) => {
  try {
    const { data } = await api.post("/comments", comment, {
      headers: auth(),
    });
    return data as POSTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(
      err.response.data as POSTResponse
    );
  }
});

export const editComment = createAsyncThunk<
  PUTResponse,
  Comment,
  { rejectValue: PUTResponse }
>("comments/editComment", async (comment, thunkApi) => {
  try {
    const { data } = await api.put(
      `/comments/${comment._id}`,
      comment,
      { headers: auth() }
    );
    return data as PUTResponse;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data as PUTResponse);
  }
});

const initialState = {
  status: "idle",
  comments: [],
  count: 0,
} as CommentState;

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    resetState: (state) => {
      state.count = 0;
      state.message = "";
      state.comments = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getComments.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getComments.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.comments = _.cloneDeep(action.payload.comments);
      state.count = action.payload.count;
      state.message = action.payload.message;
    });
    builder.addCase(getComments.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) {
        state.message = action.payload.message;
        state.comments = [];
        state.count = action.payload.count;
        state.message = action.payload.message;
      }
    });
    builder.addCase(newComment.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.comments = state.comments.concat(action.payload.comment!);
      state.count = state.count + 1;
      state.message = action.payload.message;
    });
    builder.addCase(editComment.fulfilled, (state, action) => {
      const currentIndex = state.comments.findIndex(
        (reg) => reg._id === action.payload.comment!._id
      );
      state.comments[currentIndex] = _.cloneDeep(
        action.payload.comment!
      );
      state.message = action.payload.message;
    });
  },
});

export const { resetState } = commentSlice.actions;

export default commentSlice.reducer;
