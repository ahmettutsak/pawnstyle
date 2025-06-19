"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, X, PawPrint } from "lucide-react";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";

type CartItem = {
  id: number;
  quantity: number;
  size: string;
};

function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [count, setCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCount(total);
    };

    updateCount();

    window.addEventListener("storage", updateCount);
    window.addEventListener("cartUpdated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cartUpdated", updateCount);
    };
  }, []);

  // Supabase oturum kontrolü
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    // Oturum değişikliklerini dinle
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="bg-[var(--background)] shadow-md fixed w-full z-20 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-[var(--foreground)] text-2xl font-bold"
            >
              <PawPrint size={32} className="inline-block mr-2" />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-[var(--foreground)] relative">
              <ShoppingCart size={24} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--red)] text-[var(--background)] text-xs rounded-full px-1.5 py-0.5">
                  {count}
                </span>
              )}
            </Link>

            {/* isLoggedIn durumunu UserMenu'ye gönder */}
            <UserMenu isLoggedIn={isLoggedIn} />

            <button
              className="text-[var(--foreground)] focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="bg-[var(--background)] shadow-md border-t border-[var(--foreground)] rounded-b-lg px-6 py-6"
        >
          <div className="space-y-12 flex flex-col items-center md:items-start">
            <Link
              href="/"
              className="block text-[var(--foreground)] font-sans font-semibold text-2xl"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block text-[var(--foreground)] font-sans font-semibold text-2xl"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block text-[var(--foreground)] font-sans font-semibold text-2xl"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-[var(--foreground)] font-sans font-semibold text-2xl"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
