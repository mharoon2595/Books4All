import { createSlice } from "@reduxjs/toolkit";

const signedIn = createSlice({
  name: "signInStatus",
  initialState: {
    register: false,
    signedIn: false,
    username: "",
  },
  reducers: {
    toggleSignIn(state, action) {
      state.signedIn = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    register(state, action) {
      state.register = action.payload;
    },
  },
});

export const { toggleSignIn, setUsername, register } = signedIn.actions;
export default signedIn;
