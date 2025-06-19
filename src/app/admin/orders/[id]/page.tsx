"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

const statusOptions: Order["status"][] = [
  "Pending",
  "Preparing",
  "Shipped",
  "Completed",
  "Cancelled",
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [status, setStatus] = useState<Order["status"]>("Pending");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const found = mockOrders.find((o) => o.id === Number(id));
    if (found) {
      setOrder(found);
      setTrackingNumber(found.trackingNumber || "");
      setStatus(found.status);
    }
  }, [id]);

  if (!order) {
    return (
      <div className="text-center text-[var(--foreground)] mt-12">
        Order not found.
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setOrder({
      ...order,
      status,
      trackingNumber,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-[var(--background)] text-[var(--foreground)] rounded-md shadow-md mt-6 space-y-6">
      <h1 className="text-2xl font-bold">Order #{order.id}</h1>

      <div className="space-y-2">
        <div>
          <span className="font-semibold">Customer:</span> {order.customerName}
        </div>
        <div>
          <span className="font-semibold">Total:</span> $
          {order.totalAmount.toFixed(2)}
        </div>
        <div>
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(order.createdAt).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Order Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Order["status"])}
            className="w-full px-4 py-2 bg-transparent border [var(--foreground)] text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option} className="text-black">
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tracking Number
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className="w-full px-4 py-2 bg-transparent border [var(--foreground)] text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] placeholder:text-[rgba(255,255,255,0.4)]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[var(--foreground)] text-[var(--background)] font-semibold py-2 rounded-md"
        >
          Save Changes
        </button>

        {saved && (
          <div className="text-sm text-[var(--green)] text-center mt-2">
            Changes saved successfully.
          </div>
        )}
      </form>
    </div>
  );
}
