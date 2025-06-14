"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
};

function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function setCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cart));
}

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const updateQuantity = (id: number, size: string, qty: number) => {
    const newCart = cartItems.map((item) =>
      item.id === id && item.size === size
        ? { ...item, quantity: Math.max(1, qty) }
        : item
    );
    setCartItems(newCart);
    setCart(newCart);
  };

  const removeItem = (id: number, size: string) => {
    const newCart = cartItems.filter(
      (item) => !(item.id === id && item.size === size)
    );
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setCartItems(newCart);
    setCart(newCart);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mt-24 min-h-[80vh] mx-auto p-6">
      <h1 className="text-3xl font-mono mb-6 text-[var(--foreground)]">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="font-sans text-[var(--foreground)]">
          Your cart is empty.
        </p>
      ) : (
        <>
          <ul className="space-y-6 overflow-y-auto max-h-[60vh]">
            {cartItems.map(
              ({ id, name, price, quantity, size, image }, index) => (
                <li
                  key={index}
                  className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[var(--foreground)] pb-4 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={image}
                      alt={name}
                      width={80}
                      height={80}
                      className="rounded"
                    />
                    <div>
                      <h2 className="font-mono text-lg text-[var(--foreground)]">
                        {name}
                      </h2>
                      <p className="font-sans text-[var(--foreground)]">
                        ${price.toFixed(2)} - Size: {size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) =>
                        updateQuantity(id, size, parseInt(e.target.value))
                      }
                      className="w-16 p-1 border border-[var(--foreground)] rounded bg-[var(--background)] text-[var(--foreground)] font-sans"
                    />
                    <button
                      onClick={() => removeItem(id, size)}
                      className="px-3 py-1 border border-[var(--red)] text-[var(--red)] rounded font-mono"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>

          <div className="mt-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <p className="font-mono text-xl text-[var(--foreground)]">
              Total: ${totalPrice.toFixed(2)}
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                href="/shop"
                className="px-6 py-2 border border-[var(--foreground)] rounded font-mono text-[var(--foreground)] text-center"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => alert("Proceed to checkout")}
                className="px-6 py-2 border border-[var(--foreground)] rounded font-mono text-[var(--foreground)]"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
