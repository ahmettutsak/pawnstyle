"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Cozy Dog Sweater",
      price: 25.99,
      quantity: 2,
      image: "/hero.png",
    },
    {
      id: 2,
      name: "Raincoat for Dogs",
      price: 30.0,
      quantity: 1,
      image: "/hero.png",
    },
    {
      id: 2,
      name: "Raincoat for Dogs",
      price: 30.0,
      quantity: 1,
      image: "/hero.png",
    },
    {
      id: 2,
      name: "Raincoat for Dogs",
      price: 30.0,
      quantity: 1,
      image: "/hero.png",
    },
    {
      id: 2,
      name: "Raincoat for Dogs",
      price: 30.0,
      quantity: 1,
      image: "/hero.png",
    },
  ]);

  const updateQuantity = (id: number, qty: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl min-h-[80vh] mx-auto p-6">
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
            {cartItems.map(({ id, name, price, quantity, image }) => (
              <li
                key={id}
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
                      ${price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto">
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      updateQuantity(id, parseInt(e.target.value))
                    }
                    className="w-16 p-1 border border-[var(--foreground)] rounded bg-[var(--background)] text-[var(--foreground)] font-sans"
                  />
                  <button
                    onClick={() => removeItem(id)}
                    className="px-3 py-1 border border-[var(--red)] text-[var(--red)] rounded font-mono"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
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
