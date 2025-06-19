"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  customerName: string;
  totalAmount: number;
  status: "Pending" | "Preparing" | "Shipped" | "Cancelled" | "Completed";
  createdAt: string;
  trackingNumber?: string;
};

const mockOrders: Order[] = [
  {
    id: 101,
    customerName: "Ahmet Yılmaz",
    totalAmount: 125.5,
    status: "Pending",
    createdAt: "2025-06-15T14:32:00Z",
  },
  {
    id: 102,
    customerName: "Zeynep Kaya",
    totalAmount: 85,
    status: "Shipped",
    createdAt: "2025-06-14T10:15:00Z",
    trackingNumber: "TRK123456789",
  },
  {
    id: 103,
    customerName: "Mehmet Demir",
    totalAmount: 230,
    status: "Completed",
    createdAt: "2025-06-10T08:20:00Z",
    trackingNumber: "TRK987654321",
  },
];

function getStatusColor(status: Order["status"]) {
  switch (status) {
    case "Pending":
    case "Preparing":
    case "Shipped":
      return "text-[var(--yellow)]";
    case "Cancelled":
      return "text-[var(--red)]";
    case "Completed":
      return "text-[var(--green)]";
    default:
      return "";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[var(--background)] text-[var(--foreground)] rounded-md shadow-md">
      <h1 className="text-3xl font-semibold mb-6">Orders</h1>

      <table className="w-full border-collapse border border-[var(--foreground)]">
        <thead>
          <tr className="border-b border-[var(--foreground)]">
            <th className="text-left py-3 px-4">Order ID</th>
            <th className="text-left py-3 px-4">Customer</th>
            <th className="text-left py-3 px-4">Total</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Tracking #</th>
            <th className="text-left py-3 px-4">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => router.push(`/admin/orders/${order.id}`)}
              className="border-b border-[var(--foreground)] hover:bg-[var(--foreground)]/10 cursor-pointer transition"
            >
              <td className="py-3 px-4">{order.id}</td>
              <td className="py-3 px-4">{order.customerName}</td>
              <td className="py-3 px-4">${order.totalAmount.toFixed(2)}</td>
              <td
                className={`py-3 px-4 font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </td>
              <td className="py-3 px-4">{order.trackingNumber || "-"}</td>
              <td className="py-3 px-4">
                {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="text-center py-6 text-[rgba(255,255,255,0.4)]"
              >
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
