const CART_STORAGE_KEY = 'storefront-cart';

export function loadCartState() {
  try {
    const serializedState = localStorage.getItem(CART_STORAGE_KEY);

    if (!serializedState) {
      return undefined;
    }

    const parsedState = JSON.parse(serializedState);

    if (!parsedState || typeof parsedState !== 'object') {
      return undefined;
    }

    return {
      cart: {
        items: Array.isArray(parsedState.items) ? parsedState.items : [],
        totalQuantity: Number(parsedState.totalQuantity ?? 0),
        totalPrice: Number(parsedState.totalPrice ?? 0),
      },
    };
  } catch {
    return undefined;
  }
}

export function saveCartState(cartState) {
  try {
    const serializedState = JSON.stringify({
      items: cartState.items,
      totalQuantity: cartState.totalQuantity,
      totalPrice: cartState.totalPrice,
    });

    localStorage.setItem(CART_STORAGE_KEY, serializedState);
  } catch {
    // Ignore localStorage write errors.
  }
}
