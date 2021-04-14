import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  teachingSearchText: string;
  courseSearchText: string;
  userSearchText: string;
  labSearchText: string;
}

const initialState: SearchState = {
  teachingSearchText: "",
  courseSearchText: "",
  userSearchText: "",
  labSearchText: "",
};

export const SearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetState: (state) => {
      state.teachingSearchText = "";
      state.courseSearchText = "";
      state.userSearchText = "";
      state.labSearchText = "";
    },
    setTeachingSearch: (state, action: PayloadAction<string>) => {
      state.teachingSearchText = action.payload;
    },
    setCourseSearch: (state, action: PayloadAction<string>) => {
      state.courseSearchText = action.payload;
    },
    setUserSearch: (state, action: PayloadAction<string>) => {
      state.userSearchText = action.payload;
    },
    setLabSearch: (state, action: PayloadAction<string>) => {
      state.labSearchText = action.payload;
    },
  },
});

export const {
  setTeachingSearch,
  setCourseSearch,
  setUserSearch,
  setLabSearch,
  resetState,
} = SearchSlice.actions;

export default SearchSlice.reducer;
