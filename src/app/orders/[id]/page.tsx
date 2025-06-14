"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

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
    trackingNumber: "TRK123456789",
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

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState<(typeof mockOrders)[0] | null>(null);

  useEffect(() => {
    const found = mockOrders.find((o) => o.id === orderId);
    setOrder(found || null);
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-4xl mt-24 mx-auto p-6 text-[var(--foreground)] font-mono">
        Order not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-24 mx-auto p-6 bg-[var(--background)] rounded shadow-md">
      <h1 className="text-3xl mb-6 font-mono text-[var(--foreground)]">
        Order #{order.id}
      </h1>
      <p className="mb-2 text-[var(--foreground)] font-sans">
        Date: {order.date}
      </p>
      <p className="mb-4 text-[var(--foreground)] font-sans font-semibold">
        Status:{" "}
        <span
          className={
            order.status === "Delivered"
              ? "text-[var(--green)]"
              : order.status === "Shipped"
              ? "text-[var(--yellow)]"
              : "text-[var(--red)]"
          }
        >
          {order.status}
        </span>
      </p>

      {order.status === "Shipped" && order.trackingNumber && (
        <p className="mt-4 text-[var(--foreground)] font-sans">
          <span className="font-semibold">Tracking Number:</span>{" "}
          {order.trackingNumber}
        </p>
      )}

      <div>
        <h2 className="text-2xl mb-4 font-mono text-[var(--foreground)]">
          Items
        </h2>
        <ul className="space-y-2 text-[var(--foreground)] font-sans">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 font-semibold text-[var(--foreground)] text-right text-lg">
        Total: ${order.total.toFixed(2)}
      </p>
    </div>
  );
}
