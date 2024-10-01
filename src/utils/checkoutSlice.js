import { createSlice } from "@reduxjs/toolkit";

const checkout = createSlice({
  name: "checkout",
  initialState: {
    cart: 0,
    books: [],
  },
  reducers: {
    increaseCart(state, action) {
      state.cart = state.cart + 1;
      state.books = [...state.books, action.payload];
    },
    decreaseCart(state, action) {
      if (state.cart > 0) {
        state.cart = state.cart - 1;
        state.books = state.books.filter((item) => item !== action.payload);
      }
    },
    borrow(state, action) {
      state.cart = 0;
      state.books = [];
    },
  },
});

export const { increaseCart, decreaseCart, borrow } = checkout.actions;
export default checkout;
