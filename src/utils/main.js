import { configureStore } from "@reduxjs/toolkit";
import signedIn from "./signedInSlice";

const store = configureStore({
  reducer: {
    status: signedIn.reducer,
  },
});

export default store;
