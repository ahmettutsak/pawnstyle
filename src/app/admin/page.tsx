"use client";
import { useState, useEffect } from "react";

type Stats = {
  products: number;
  orders: number;
  messages: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // Burada backend'den veri çekeceksin, şimdilik örnek data:
    setStats({
      products: 120,
      orders: 57,
      messages: 23,
    });
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <p className="text-4xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="text-4xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Messages</h2>
          <p className="text-4xl font-bold">{stats.messages}</p>
        </div>
      </div>
    </div>
  );
}
