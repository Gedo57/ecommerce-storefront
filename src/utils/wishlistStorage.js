const WISHLIST_STORAGE_KEY = 'storefront-wishlist';

export function loadWishlistState() {
  try {
    const serializedState = localStorage.getItem(WISHLIST_STORAGE_KEY);

    if (!serializedState) {
      return undefined;
    }

    const parsedState = JSON.parse(serializedState);

    if (!parsedState || typeof parsedState !== 'object') {
      return undefined;
    }

    const items = Array.isArray(parsedState.items) ? parsedState.items : [];

    return {
      wishlist: {
        items,
        totalQuantity: Number(parsedState.totalQuantity ?? items.length),
      },
    };
  } catch {
    return undefined;
  }
}

export function saveWishlistState(wishlistState) {
  try {
    const serializedState = JSON.stringify({
      items: wishlistState.items,
      totalQuantity: wishlistState.totalQuantity,
    });

    localStorage.setItem(WISHLIST_STORAGE_KEY, serializedState);
  } catch {
    // Ignore localStorage write errors.
  }
}
