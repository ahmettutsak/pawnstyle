"use client";

import { useState, useMemo } from "react";
import Card from "@/components/Card";

interface Product {
  id: number;
  name: string;
  price: number;
  stars: number | string;
  count: number;
  category: string;
  images: string[];
}

const productsData: Product[] = [
  {
    id: 1,
    name: "Cozy Dog Sweater",
    price: 25.99,
    stars: 4.7,
    count: 120,
    category: "Sweaters",
    images: ["/hero.png", "/hero.png", "/hero.png"],
  },
  {
    id: 2,
    name: "Raincoat for Dogs",
    price: 30.0,
    stars: 4.2,
    count: 89,
    category: "Raincoats",
    images: ["/hero.png", "/hero.png", "/hero.png"],
  },
  {
    id: 3,
    name: "Cute Puppy Hoodie",
    price: 22.5,
    stars: 4.8,
    count: 143,
    category: "Hoodies",
    images: ["/hero.png", "/hero.png", "/hero.png"],
  },
  {
    id: 4,
    name: "Stylish Collar",
    price: 15.0,
    stars: 4.3,
    count: 75,
    category: "Accessories",
    images: ["/hero.png", "/hero.png", "/hero.png"],
  },
];

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = productsData.map((p) => p.category);
    return ["All", ...Array.from(new Set(cats))];
  }, []);

  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-12 mb-6 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-[var(--foreground)] rounded font-sans text-[var(--foreground)] bg-[var(--background)]"
          aria-label="Search products"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-[var(--foreground)] rounded font-sans text-[var(--foreground)] bg-[var(--background)]"
          aria-label="Filter by category"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-[var(--foreground)] font-sans">No products found.</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Card
              id={product.id}
              key={product.id}
              images={product.images}
              name={product.name}
              price={product.price}
              stars={product.stars}
              count={product.count}
            />
          ))}
        </section>
      )}
    </main>
  );
}
