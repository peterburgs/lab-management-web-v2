import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

interface NotificationState {
  snackBarContent?: string;
  showSuccessSnackBar?: boolean;
  showErrorSnackBar?: boolean;
}

const initialState: NotificationState = {
  snackBarContent: "",
  showSuccessSnackBar: false,
  showErrorSnackBar: false,
};

export const NotificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setShowSuccessSnackBar: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.showSuccessSnackBar = action.payload;
    },
    setShowErrorSnackBar: (state, action: PayloadAction<boolean>) => {
      state.showErrorSnackBar = action.payload;
    },
    setSnackBarContent: (state, action: PayloadAction<string>) => {
      state.snackBarContent = action.payload;
    },
  },
});

export const {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} = NotificationSlice.actions;

export default NotificationSlice.reducer;
