import { createSlice } from "@reduxjs/toolkit";

const signedIn = createSlice({
  name: "signInStatus",
  initialState: {
    signedIn: false,
    username: "",
  },
  reducers: {
    toggleSignIn(state, action) {
      state.signedIn = !state.signedIn;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
  },
});

export const { toggleSignIn, setUsername } = signedIn.actions;
export default signedIn;
