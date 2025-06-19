"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";
import Card from "@/components/Card";

interface ProductSize {
  size: string;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  discount?: number;
  stars: number;
  count: number;
  category: string;
  product_sizes: ProductSize[]; // ürünün bedenleri
}

export default function Shop() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearchTerm = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialSize = searchParams.get("size") || "All";

  const [productsData, setProductsData] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>(initialSize);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select(`
          id, name, price, images, discount, category,
          product_sizes (size, stock)
        `);

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      // Random stars ve count ekliyoruz
      const enrichedProducts: Product[] = (data || []).map((product) => ({
        ...product,
        discount: product.discount || 0,
        stars: 3.5 + Math.random() * 1.5,
        count: Math.floor(Math.random() * 200) + 1,
        product_sizes: product.product_sizes || [],
      }));

      setProductsData(enrichedProducts);
    }

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = productsData.map((p) => p.category);
    return ["All", ...Array.from(new Set(cats))];
  }, [productsData]);

  // Stok > 0 olan bedenleri filtreleyip uniq alıyoruz
  const sizes = useMemo(() => {
    const allSizes = productsData.flatMap((p) =>
      p.product_sizes
        .filter((s) => s.stock > 0) // stok sıfır olan bedenleri kaldır
        .map((s) => s.size)
    );
    return ["All", ...Array.from(new Set(allSizes))];
  }, [productsData]);

  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesSize =
        selectedSize === "All" ||
        product.product_sizes.some(
          (sizeObj) => sizeObj.size === selectedSize && sizeObj.stock > 0
        );

      return matchesCategory && matchesSearch && matchesSize;
    });
  }, [productsData, searchTerm, selectedCategory, selectedSize]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedSize !== "All") params.set("size", selectedSize);

    const queryString = params.toString();

    router.replace(queryString ? `?${queryString}` : "/shop");
  }, [searchTerm, selectedCategory, selectedSize, router]);

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 py-10">
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

        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-[var(--foreground)] rounded font-sans text-[var(--foreground)] bg-[var(--background)]"
          aria-label="Filter by size"
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
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
              key={product.id}
              id={product.id}
              images={product.images}
              name={product.name}
              price={product.price}
              stars={Number(product.stars.toFixed(1))}
              count={product.count}
              discount={product.discount}
            />
          ))}
        </section>
      )}
    </main>
  );
}
