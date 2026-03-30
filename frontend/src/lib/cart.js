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

  // ✅ Update navbar instantly
  window.dispatchEvent(new Event("cart-updated"));
}

export function addCartItem(item) {
  if (!item?.shoeId) {
    console.error("❌ Missing shoeId in item:", item);
    return;
  }

  const cart = getCartItems();

  // ✅ normalize id (VERY IMPORTANT)
  const normalizedId = String(item.shoeId);

  const existingIndex = cart.findIndex(
    (i) => String(i.shoeId) === normalizedId && i.size === item.size
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity =
      (cart[existingIndex].quantity || 1) + 1;
  } else {
    const newItem = {
      cartItemId: `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`,

      // ✅ ALWAYS store string ObjectId
      shoeId: normalizedId,

      name: item.name,
      brand: item.brand,
      price: Number(item.price) || 0,
      size: item.size,
      image: item.image,

      colors: item.colors || (item.color ? [item.color] : []),
      colorName: item.colorName || "",

      quantity: 1,
    };

    cart.push(newItem);
  }

  saveCartItems(cart);
}
export function increaseQuantity(cartItemId) {
  const cart = getCartItems();

  const item = cart.find((i) => i.cartItemId === cartItemId);
  if (!item) return;
  if (item) {
    item.quantity = (item.quantity || 1) + 1;
  }

  saveCartItems(cart);
}

export function decreaseQuantity(cartItemId) {
  let cart = getCartItems();

  const item = cart.find((i) => i.cartItemId === cartItemId);
  if (!item) return;

  if ((item.quantity || 1) > 1) {
    item.quantity -= 1;
  } else {
    // ✅ remove item if quantity = 1
    cart = cart.filter((i) => i.cartItemId !== cartItemId);
  }

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