import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  teachingSearchText: string;
  lecturerTeachingSearchText: string;
  placeholder: string;
}

const initialState: SearchState = {
  teachingSearchText: "",
  lecturerTeachingSearchText: "",
  placeholder: "Search",
};

export const SearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setLecturerTeachingSearch: (
      state,
      action: PayloadAction<string>
    ) => {
      state.lecturerTeachingSearchText = action.payload;
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
  setLecturerTeachingSearch,
  setPlaceholder,
  setTeachingSearch,
} = SearchSlice.actions;

export default SearchSlice.reducer;
