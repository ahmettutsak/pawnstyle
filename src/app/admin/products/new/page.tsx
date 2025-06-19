"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";

type SizeStock = {
  size: string;
  stock: number;
};

type Category = {
  id: number;
  name: string;
};

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [imageURLs, setImageURLs] = useState([""]);
  const [files, setFiles] = useState<File[]>([]);
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [sizes, setSizes] = useState<SizeStock[]>([
    { size: "XS", stock: 0 },
    { size: "S", stock: 0 },
    { size: "M", stock: 0 },
    { size: "L", stock: 0 },
    { size: "XL", stock: 0 },
  ]);
  const categories = [
    "Sweaters",
    "Jackets",
    "Raincoats",
    "Boots",
    "Accessories",
  ];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Image URL input handlers
  const handleImageURLChange = (index: number, value: string) => {
    const newURLs = [...imageURLs];
    newURLs[index] = value;
    setImageURLs(newURLs);
  };

  const addImageURLInput = () => {
    setImageURLs([...imageURLs, ""]);
  };

  const removeImageURLInput = (index: number) => {
    if (imageURLs.length === 1) return;
    setImageURLs(imageURLs.filter((_, i) => i !== index));
  };

  // Upload files to Supabase Storage
  const uploadFilesToSupabase = async () => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const filePath = `products/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (error) {
        console.error("File upload failed:", error.message);
        alert("Upload failed: " + error.message);
        return [];
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };

  // Sizes input handlers
  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index].size = value;
    setSizes(newSizes);
  };

  const handleStockChange = (index: number, value: number) => {
    const newSizes = [...sizes];
    newSizes[index].stock = value;
    setSizes(newSizes);
  };

  const addSizeInput = () => {
    setSizes([...sizes, { size: "", stock: 0 }]);
  };

  const removeSizeInput = (index: number) => {
    if (sizes.length === 1) return;
    setSizes(sizes.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }

    setLoading(true);

    let finalImageUrls: string[] = [];

    if (useFileUpload && files.length > 0) {
      finalImageUrls = await uploadFilesToSupabase();
      if (finalImageUrls.length === 0) {
        setLoading(false);
        return;
      }
    } else {
      finalImageUrls = imageURLs.filter((url) => url.trim() !== "");
    }

    // Insert product first
    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert({
        name,
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : 0,
        description,
        images: finalImageUrls.length > 0 ? finalImageUrls : null,
        category: selectedCategory,
        is_active: true,
      })
      .select()
      .single();

    if (productError) {
      console.error("Product insert failed:", productError.message);
      alert("Product creation failed: " + productError.message);
      setLoading(false);
      return;
    }

    // Insert sizes and stocks
    const sizesToInsert = sizes
      .filter((s) => s.size.trim() !== "")
      .map((s) => ({
        product_id: productData.id,
        size: s.size,
        stock: s.stock,
      }));

    const { error: sizeError } = await supabase
      .from("product_sizes")
      .insert(sizesToInsert);

    if (sizeError) {
      console.error("Sizes insert failed:", sizeError.message);
      alert("Size stocks creation failed: " + sizeError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/admin/products");
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] max-w-xl mx-auto p-8 rounded-md shadow-md border border-[rgba(255,255,255,0.1)]">
      <h1 className="text-3xl font-semibold mb-6 tracking-wide">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block mb-2 font-semibold text-sm">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter product name"
            className="w-full px-4 py-3 border border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] rounded-md"
          />
        </div>

        {/* Category select */}
        <div>
          <label className="block mb-2 font-semibold text-sm">Category</label>
          <select
            value={selectedCategory ?? ""}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            className="w-full px-4 py-3 border border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] rounded-md"
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price, Discount */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-sm">Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="0.00"
              className="w-full px-4 py-3 border border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] rounded-md"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm">
              Discount (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              max={100}
              min={0}
              placeholder="0"
              className="w-full px-4 py-3 border border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] rounded-md"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-semibold text-sm">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a brief description..."
            className="w-full px-4 py-3 border border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] rounded-md resize-none"
          />
        </div>

        {/* Sizes & Stocks */}
        <div>
          <label className="block mb-2 font-semibold text-sm">
            Sizes & Stocks
          </label>
          {sizes.map((item, index) => (
            <div key={index} className="flex gap-4 mb-2 items-center">
              <input
                type="text"
                value={item.size}
                onChange={(e) => handleSizeChange(index, e.target.value)}
                placeholder="Size"
                className="w-20 px-3 py-2 border rounded"
                required
              />
              <input
                type="number"
                value={item.stock}
                onChange={(e) =>
                  handleStockChange(index, parseInt(e.target.value) || 0)
                }
                placeholder="Stock"
                className="w-20 px-3 py-2 border rounded"
                min={0}
                required
              />
              {sizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSizeInput(index)}
                  className="text-red-500 font-bold"
                  title="Remove size"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSizeInput}
            className="text-blue-600 underline"
          >
            + Add size
          </button>
        </div>

        {/* Image URLs or File Upload */}
        <div>
          <label className="flex items-center mb-4 space-x-3">
            <input
              type="checkbox"
              checked={useFileUpload}
              onChange={() => setUseFileUpload((v) => !v)}
              className="w-5 h-5 border-[var(--foreground)]"
            />
            <span className="text-sm font-medium">
              Upload image files instead of URLs
            </span>
          </label>

          {!useFileUpload ? (
            <div>
              <label className="block mb-2 font-semibold text-sm">
                Image URLs
              </label>
              {imageURLs.map((url, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      handleImageURLChange(index, e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                    className="flex-grow px-4 py-3 border border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] rounded-md"
                    required={index === 0}
                  />
                  {imageURLs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageURLInput(index)}
                      className="text-red-500 px-3"
                      title="Remove URL"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageURLInput}
                className="mt-1 text-[var(--foreground)] underline"
              >
                + Add another URL
              </button>
            </div>
          ) : (
            <div>
              <label className="block mb-2 font-semibold text-sm">
                Upload Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setFiles(e.target.files ? Array.from(e.target.files) : [])
                }
                required
                className="w-full text-[var(--foreground)]"
              />
              {files.length > 0 && (
                <p className="mt-2 text-sm text-[var(--foreground)]">
                  Selected {files.length} file{files.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Submit button with loading */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-semibold rounded-md shadow
            ${
              loading
                ? "bg-gray-500 cursor-not-allowed text-gray-300"
                : "bg-[var(--foreground)] text-[var(--background)]"
            }
          `}
        >
          {loading ? "Loading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
