"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User } from "lucide-react";

interface UserMenuProps {
  isLoggedIn: boolean;
}

export default function UserMenu({ isLoggedIn }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-[var(--foreground)] focus:outline-none"
        aria-label="Toggle user menu"
      >
        <User size={24} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-[var(--background)] border border-[var(--foreground)] rounded shadow-md font-sans text-[var(--foreground)]">
          {isLoggedIn ? (
            <ul className="flex flex-col space-y-2 p-3">
              <li>
                <Link href="/profile" onClick={() => setOpen(false)}>
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" onClick={() => setOpen(false)}>
                  Orders
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="text-left w-full"
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="flex flex-col space-y-2 p-3">
              <li>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
