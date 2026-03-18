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

  const newItem = {
    cartItemId: `${Date.now()}-${Math.random().toString(16).slice(2)}`, // ⭐ UI id
    shoeId: item.shoeId,   // ⭐ VERY IMPORTANT (backend id)
    name: item.name,
    price: item.price,
    size: item.size,
    image: item.image,
    colorName: item.colorName,
  };

  cart.push(newItem);
  saveCartItems(cart);
}

export function removeCartItem(cartItemId) {
  const cart = getCartItems().filter(
    (item) => item.cartItemId !== cartItemId
  );
  saveCartItems(cart);
}

export function clearCart() {
  saveCartItems([]);
}