"use client";

import Link from "next/link";
import { PawPrint } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[var(--foreground)] text-[var(--background)] text-sm mt-10">
      <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-6 md:space-y-0">
          <div className="font-sans">
            <div className="flex items-center mb-2">
              <PawPrint size={32} className="inline-block mr-2" />
              <h2 className="font-mono text-xl">Pawnstyle</h2>
            </div>
            <p className="opacity-40">
              Luxury canine fashion designed for elegance and comfort. Elevate
              your dog's wardrobe with premium craftsmanship.
            </p>
          </div>

          <div className="font-sans">
            <h3 className="text-lg font-mono font-semibold mb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="opacity-40 font-sans">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="opacity-40 font-sans">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="opacity-40 font-sans">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="opacity-40 font-sans">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="font-sans">
            <h3 className="text-lg font-mono font-semibold mb-2">Contact</h3>
            <ul className="space-y-2">
              <li>
                <span className="font-sans">Phone: +1 (800) 555-1234</span>
              </li>
              <li>
                <span className="font-sans">Email: support@pawstyle.com</span>
              </li>
              <li>
                <span className="font-sans">
                  Address: 123 Fashion Ave, New York, NY, USA
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--background)] pt-4 text-center">
          <h1 className="text-[var(--background)] opacity-50 font-mono">
            © {currentYear} PAWSTYLE. All rights reserved.
          </h1>
        </div>
      </div>
    </footer>
  );
}
