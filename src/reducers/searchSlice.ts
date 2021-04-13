import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  teachingSearchText: string;
  courseSearchText: string;
  userSearchText: string;
}

const initialState: SearchState = {
  teachingSearchText: "",
  courseSearchText: "",
  userSearchText: "",
};

export const SearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetState: (state) => {
      state.teachingSearchText = "";
      state.courseSearchText = "";
      state.userSearchText = "";
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
  },
});

export const {
  setTeachingSearch,
  setCourseSearch,
  setUserSearch,
  resetState,
} = SearchSlice.actions;

export default SearchSlice.reducer;
