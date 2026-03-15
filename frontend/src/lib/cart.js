const CART_KEY = "cart";

export function getCartItems() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addCartItem(item) {
  const cart = getCartItems();
  cart.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ...item,
  });
  saveCartItems(cart);
}

export function removeCartItem(itemId) {
  const cart = getCartItems().filter((item) => item.id !== itemId);
  saveCartItems(cart);
}

export function clearCart() {
  saveCartItems([]);
}
