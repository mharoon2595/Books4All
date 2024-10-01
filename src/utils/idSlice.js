import { createSlice } from "@reduxjs/toolkit";

const idSlice = createSlice({
  name: "idSlice",
  initialState: {
    list: {},
    userId: {},
  },
  reducers: {
    pushId(state, action) {
      state.list = { ...action.payload };
    },
    pushUserId(state, action) {
      state.userId = { ...action.payload };
    },
  },
});

export const { pushId, pushUserId } = idSlice.actions;
export default idSlice;
