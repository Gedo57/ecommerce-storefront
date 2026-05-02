import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

function getLineId(item) {
  return item.cartLineId || `${item.id}::${item.selectedColor?.name || 'default'}::${item.selectedSize || 'default'}`;
}

function normalizeItem(item) {
  return {
    ...item,
    quantity: Number(item.quantity || 1),
    cartLineId: getLineId(item),
  };
}

function recalculateCart(state) {
  state.items = state.items.map(normalizeItem);
  state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = normalizeItem(action.payload);
      const existingItem = state.items.find((item) => getLineId(item) === product.cartLineId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      recalculateCart(state);
    },
    decreaseQuantity: (state, action) => {
      const lineId = action.payload;
      const existingItem = state.items.find((item) => getLineId(item) === lineId || item.id === lineId);

      if (!existingItem) return;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => getLineId(item) !== getLineId(existingItem));
      } else {
        existingItem.quantity -= 1;
      }

      recalculateCart(state);
    },
    removeItemCompletely: (state, action) => {
      const lineId = action.payload;
      state.items = state.items.filter((item) => getLineId(item) !== lineId && item.id !== lineId);
      recalculateCart(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, decreaseQuantity, removeItemCompletely, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
