"use client";

import Link from "next/link";
import { useState } from "react";

const mockUser = {
  name: "Ahmet Tutsak",
  email: "ahmet@example.com",
  joined: "2023-08-14",
};

const mockOrders = [
  {
    id: "ORD-20230601",
    date: "2024-06-01",
    total: 59.99,
    status: "Delivered",
  },
  {
    id: "ORD-20230512",
    date: "2024-05-12",
    total: 42.5,
    status: "Shipped",
  },
  {
    id: "ORD-20230430",
    date: "2024-04-30",
    total: 33.0,
    status: "Cancelled",
  },
];

export default function ProfileScreen() {
  const [user] = useState(mockUser);
  const [orders] = useState(mockOrders);

  return (
    <div className="max-w-4xl mt-12 mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-mono text-[var(--foreground)] mb-8">
        My Profile
      </h1>

      {/* User Info */}
      <div className="bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-6 mb-12">
        <h2 className="text-xl font-mono text-[var(--foreground)] mb-4">
          User Info
        </h2>
        <div className="text-[var(--foreground)] font-sans space-y-2">
          <p>
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Joined:</span> {user.joined}
          </p>
        </div>
      </div>

      {/* Order History */}
      <div>
        <h2 className="text-xl font-mono text-[var(--foreground)] mb-4">
          Order History
        </h2>
        <div className="space-y-4">
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
    </div>
  );
}
