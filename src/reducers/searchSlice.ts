import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  teachingSearchText: string;
  placeholder: string;
}

const initialState: SearchState = {
  teachingSearchText: "",
  placeholder: "Search",
};

export const SearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetState: (state) => {
      state.teachingSearchText = "";
    },
    setTeachingSearch: (state, action: PayloadAction<string>) => {
      state.teachingSearchText = action.payload;
    },
    setPlaceholder: (state, action: PayloadAction<string>) => {
      state.placeholder = action.payload;
    },
  },
});

export const {
  setPlaceholder,
  setTeachingSearch,
  resetState
} = SearchSlice.actions;

export default SearchSlice.reducer;
