"use client";

import Link from "next/link";

export default function ANavbar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-60 p-4 border-r z-30">
      <h2 className="font-bold text-xl mb-6">Admin</h2>
      <nav className="flex flex-col space-y-2">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/messages">Messages</Link>
      </nav>
    </aside>
  );
}
