import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
};

function recalculateWishlist(state) {
  state.totalQuantity = state.items.length;
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((item) => item.id === product.id);

      if (exists) {
        state.items = state.items.filter((item) => item.id !== product.id);
      } else {
        state.items.push(product);
      }

      recalculateWishlist(state);
    },
    removeWishlistItem: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      recalculateWishlist(state);
    },
    clearWishlist: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    },
  },
});

export const { toggleWishlistItem, removeWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
