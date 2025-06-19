"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase/supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  discount?: number;
  images: string[] | null;
  product_sizes: { stock: number }[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBest, setSelectedBest] = useState<number[]>([]);
  const productsPerPage = 10;

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(
          `
          id,
          name,
          price,
          discount,
          images,
          product_sizes (
            stock
          )
        `
        );

      const { data: bestData, error: bestError } = await supabase
        .from("best_products")
        .select("product_id");

      if (productError || bestError) {
        setProducts([]);
        setSelectedBest([]);
      } else {
        setProducts(productData ?? []);
        setSelectedBest((bestData ?? []).map((b) => b.product_id));
      }

      setLoading(false);
    }

    fetchAll();
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const toggleBestProduct = async (productId: number) => {
    const alreadySelected = selectedBest.includes(productId);

    if (alreadySelected) {
      const { error } = await supabase
        .from("best_products")
        .delete()
        .eq("product_id", productId);
      if (!error) {
        setSelectedBest(selectedBest.filter((id) => id !== productId));
      }
    } else {
      if (selectedBest.length >= 5) return;

      const { error } = await supabase
        .from("best_products")
        .insert({ product_id: productId });

      if (!error) {
        setSelectedBest([...selectedBest, productId]);
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-black text-white px-4 py-2 rounded hover:opacity-80 transition"
        >
          Add Product
        </Link>
      </div>

      <table className="w-full text-left border">
        <thead className="text-sm uppercase">
          <tr>
            <th className="px-4 py-2 border-b">Preview</th>
            <th className="px-4 py-2 border-b">Product</th>
            <th className="px-4 py-2 border-b">Price</th>
            <th className="px-4 py-2 border-b">Discount (%)</th>
            <th className="px-4 py-2 border-b">Discounted Price</th>
            <th className="px-4 py-2 border-b">Stock</th>
            <th className="px-4 py-2 border-b">Actions</th>
            <th className="px-4 py-2 border-b text-center">Best</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-6 text-gray-500">
                No products found.
              </td>
            </tr>
          ) : (
            paginatedProducts.map((product) => {
              const discount = product.discount ?? 0;
              const discountedPrice = product.price * (1 - discount / 100);
              const totalStock = product.product_sizes.reduce(
                (acc, ps) => acc + ps.stock,
                0
              );
              const isBest = selectedBest.includes(product.id);

              return (
                <tr key={product.id} className="border-b">
                  <td className="px-4 py-2 space-x-2 flex">
                    {(product.images ?? []).slice(0, 3).map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        alt={`${product.name} image ${i + 1}`}
                        width={40}
                        height={40}
                        className="rounded object-cover border"
                      />
                    ))}
                  </td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-2">{discount.toFixed(2)}%</td>
                  <td className="px-4 py-2">${discountedPrice.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {totalStock > 0 ? (
                      totalStock
                    ) : (
                      <span className="text-[var(--red)]">Out of stock</span>
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="px-3 py-1 bg-[var(--green)] text-white rounded"
                    >
                      Edit
                    </Link>
                    <button className="px-3 py-1 bg-[var(--red)] text-white rounded">
                      Delete
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={isBest}
                      onChange={() => toggleBestProduct(product.id)}
                      disabled={!isBest && selectedBest.length >= 5}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      {selectedBest.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Best Products</h2>
          <table className="w-full text-left border">
            <thead className="text-sm uppercase">
              <tr>
                <th className="px-4 py-2 border-b">Preview</th>
                <th className="px-4 py-2 border-b">Product</th>
                <th className="px-4 py-2 border-b">Price</th>
                <th className="px-4 py-2 border-b">Discount (%)</th>
                <th className="px-4 py-2 border-b">Discounted Price</th>
                <th className="px-4 py-2 border-b">Stock</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((product) => selectedBest.includes(product.id))
                .map((product) => {
                  const totalStock = product.product_sizes.reduce(
                    (acc, ps) => acc + ps.stock,
                    0
                  );
                  const discount = product.discount ?? 0;
                  const discountedPrice = product.price * (1 - discount / 100);

                  return (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-2 space-x-2 flex">
                        {(product.images ?? []).slice(0, 3).map((img, i) => (
                          <Image
                            key={i}
                            src={img}
                            alt={`${product.name} image ${i + 1}`}
                            width={40}
                            height={40}
                            className="rounded object-cover border"
                          />
                        ))}
                      </td>
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-2">{discount.toFixed(2)}%</td>
                      <td className="px-4 py-2">
                        ${discountedPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {totalStock > 0 ? (
                          totalStock
                        ) : (
                          <span className="text-[var(--red)]">
                            Out of stock
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="px-3 py-1 bg-[var(--green)] text-white rounded"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => toggleBestProduct(product.id)}
                          className="px-3 py-1 bg-[var(--red)] text-white rounded"
                        >
                          Remove Best
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
