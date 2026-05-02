import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import { loadCartState, saveCartState } from '../utils/cartStorage';
import { loadWishlistState, saveWishlistState } from '../utils/wishlistStorage';

const preloadedState = {
  ...loadCartState(),
  ...loadWishlistState(),
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveCartState(state.cart);
  saveWishlistState(state.wishlist);
});
