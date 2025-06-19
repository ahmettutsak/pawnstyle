"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/supabase";

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [orders] = useState([
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
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, address")
        .eq("id", user.id)
        .single();

      setProfile({
        full_name: data?.full_name || "",
        email: user.email || "",
        phone: data?.phone || "",
        address: data?.address || "",
      });

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("profiles").upsert({
      id: user?.id,
      full_name: profile.full_name,
      phone: profile.phone,
      address: profile.address,
    });

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="text-center mt-24 text-[var(--foreground)]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-12 mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-mono text-[var(--foreground)] mb-8">
        My Profile
      </h1>

      <div className="bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-6 mb-12">
        <h2 className="text-xl font-mono text-[var(--foreground)] mb-4">
          User Info
        </h2>
        <div className="text-[var(--foreground)] font-sans space-y-2">
          <p>
            <span className="font-semibold">Name:</span> {profile.full_name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {profile.email}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {profile.phone}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {profile.address}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-mono mb-2">Edit Information</h3>
          <input
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-[var(--foreground)] rounded bg-[var(--background)] text-[var(--foreground)]"
          />
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full px-4 py-2 border border-[var(--foreground)] rounded bg-[var(--background)] text-[var(--foreground)]"
          />
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            rows={3}
            placeholder="Address"
            className="w-full px-4 py-2 border border-[var(--foreground)] rounded bg-[var(--background)] text-[var(--foreground)]"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-[var(--foreground)] text-[var(--background)] font-semibold rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

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
