import { configureStore } from "@reduxjs/toolkit";
import signedIn from "./signedInSlice";
import bookDetails from "./bookSlice";
import checkout from "./checkoutSlice";
import idSlice from "./idSlice";

const store = configureStore({
  reducer: {
    status: signedIn.reducer,
    book: bookDetails.reducer,
    checkout: checkout.reducer,
    idSlice: idSlice.reducer,
  },
});

export default store;
