"use client";

import Link from "next/link";
import { useState } from "react";

const mockOrders = [
  {
    id: "ORD-20230601",
    date: "2024-06-01",
    total: 59.99,
    status: "Delivered",
    items: [
      { name: "Cozy Dog Sweater", quantity: 1, price: 25.99 },
      { name: "Raincoat for Dogs", quantity: 1, price: 34.0 },
    ],
  },
  {
    id: "ORD-20230512",
    date: "2024-05-12",
    total: 42.5,
    status: "Shipped",
    items: [{ name: "Stylish Dog Hat", quantity: 2, price: 21.25 }],
  },
  {
    id: "ORD-20230430",
    date: "2024-04-30",
    total: 33.0,
    status: "Cancelled",
    items: [{ name: "Reflective Dog Collar", quantity: 1, price: 33.0 }],
  },
];

export default function OrdersPage() {
  const [orders] = useState(mockOrders);

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-mono text-[var(--foreground)] mb-8">
        My Orders
      </h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`} className="block">
            <div className="border border-[var(--gray)] rounded p-6 bg-[var(--background)] cursor-pointer flex justify-between">
              <div className="text-[var(--foreground)] font-sans">
                <p className="font-mono text-sm">#{order.id}</p>
                <p className="text-sm opacity-70">{order.date}</p>
              </div>
              <div className="text-right text-[var(--foreground)] font-sans">
                <p className="text-sm font-semibold">
                  ${order.total.toFixed(2)}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    order.status === "Delivered"
                      ? "text-[var(--green)]"
                      : order.status === "Shipped"
                      ? "text-[var(--yellow)]"
                      : "text-[var(--red)]"
                  }`}
                >
                  {order.status}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
