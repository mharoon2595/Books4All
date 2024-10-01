import { createSlice } from "@reduxjs/toolkit";

const bookDetails = createSlice({
  name: "bookDetails",
  initialState: {
    book: "",
    url: "",
  },
  reducers: {
    setBook(state, action) {
      state.book = action.payload;
    },
    setUrl(state, action) {
      state.url = action.payload;
    },
  },
});

export const { setBook, setUrl } = bookDetails.actions;
export default bookDetails;
