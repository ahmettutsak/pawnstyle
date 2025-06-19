"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/supabase";

type ImageEntry = {
  url: string;
  file?: File | null;
  preview?: string;
};

const categories = ["Sweaters", "Jackets", "Raincoats", "Boots", "Accessories"];
const sizes = ["XS", "S", "M", "L", "XL"];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<ImageEntry[]>([{ url: "" }]);
  const [stockBySize, setStockBySize] = useState<Record<string, number>>({
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Fetch product error:", error);
        return;
      }

      setName(data.name);
      setPrice(data.price.toString());
      setDiscount(data.discount?.toString() || "");
      setDescription(data.description);
      setCategory(data.category || categories[0]);
      setIsActive(data.is_active ?? true);
      setImages((data.images || []).map((url: string) => ({ url })));

      const { data: sizesData, error: sizesError } = await supabase
        .from("product_sizes")
        .select("size, stock")
        .eq("product_id", productId);

      if (sizesError) {
        console.error("Fetch product sizes error:", sizesError);
        return;
      }

      const stockMap: Record<string, number> = {
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
      };
      sizesData?.forEach(({ size, stock }: { size: string; stock: number }) => {
        if (sizes.includes(size)) {
          stockMap[size] = stock;
        }
      });
      setStockBySize(stockMap);
    }

    fetchProduct();
  }, [productId]);

  const handleUrlChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index].url = value;
    if (newImages[index].file) {
      newImages[index].file = null;
      newImages[index].preview = undefined;
    }
    setImages(newImages);
  };

  const handleFileChange = (index: number, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];
    const newImages = [...images];
    newImages[index].file = file;
    newImages[index].url = "";

    const reader = new FileReader();
    reader.onload = (e) => {
      newImages[index].preview = e.target?.result as string;
      setImages([...newImages]);
    };
    reader.readAsDataURL(file);
  };

  const addImageInput = () => {
    setImages([...images, { url: "" }]);
  };

  const removeImageInput = (index: number) => {
    if (images.length === 1) return;
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const priceNumber = parseFloat(price);
    const discountNumber = parseFloat(discount) || 0;

    if (isNaN(priceNumber) || priceNumber < 0) {
      alert("Price must be a positive number.");
      setLoading(false);
      return;
    }

    if (discountNumber < 0 || discountNumber > 100) {
      alert("Discount must be between 0 and 100.");
      setLoading(false);
      return;
    }

    for (const size of sizes) {
      const stockVal = stockBySize[size];
      if (
        stockVal === undefined ||
        isNaN(stockVal) ||
        stockVal < 0 ||
        !Number.isInteger(stockVal)
      ) {
        alert(`Stock for size ${size} must be a non-negative integer.`);
        setLoading(false);
        return;
      }
    }

    try {
      const updatedImages = await Promise.all(
        images.map(async (img, index) => {
          if (img.file) {
            const fileExt = img.file.name.split(".").pop();
            const fileName = `${productId}_${Date.now()}_${index}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from("product-images")
              .upload(filePath, img.file, {
                cacheControl: "3600",
                upsert: true,
              });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
              .from("product-images")
              .getPublicUrl(filePath);

            return { url: data.publicUrl };
          } else {
            return { url: img.url };
          }
        })
      );

      const updatedProduct = {
        id: Number(productId),
        name,
        price: priceNumber,
        discount: discountNumber,
        description,
        category,
        images: updatedImages.map((img) => img.url),
        is_active: isActive,
      };

      const { error: productUpdateError } = await supabase
        .from("products")
        .update({
          name: updatedProduct.name,
          price: updatedProduct.price,
          discount: updatedProduct.discount,
          description: updatedProduct.description,
          category: updatedProduct.category,
          images: updatedProduct.images,
          is_active: updatedProduct.is_active,
        })
        .eq("id", updatedProduct.id);

      if (productUpdateError) {
        console.error("Update product error:", productUpdateError);
        alert("Ürün güncellenirken hata oluştu.");
        setLoading(false);
        return;
      }

      for (const size of sizes) {
        const stockVal = stockBySize[size];

        const { data: existing, error: existingError } = await supabase
          .from("product_sizes")
          .select("id")
          .eq("product_id", productId)
          .eq("size", size)
          .single();

        if (existingError && existingError.code !== "PGRST116") {
          console.error("Error checking existing size stock:", existingError);
          alert("Stok güncellenirken hata oluştu.");
          setLoading(false);
          return;
        }

        if (existing) {
          const { error: updateError } = await supabase
            .from("product_sizes")
            .update({ stock: stockVal })
            .eq("id", existing.id);

          if (updateError) {
            console.error("Update size stock error:", updateError);
            alert("Stok güncellenirken hata oluştu.");
            setLoading(false);
            return;
          }
        } else {
          const { error: insertError } = await supabase
            .from("product_sizes")
            .insert({ product_id: Number(productId), size, stock: stockVal });

          if (insertError) {
            console.error("Insert size stock error:", insertError);
            alert("Stok güncellenirken hata oluştu.");
            setLoading(false);
            return;
          }
        }
      }

      router.push("/admin/products");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Bir hata oluştu.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[var(--background)] text-[var(--foreground)] rounded-md border border-[var(--foreground)] shadow-md">
      <h1 className="text-3xl font-semibold mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full rounded-md border border-[var(--foreground)] bg-[var(--background)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] placeholder:text-[rgba(255,255,255,0.5)]"
          />
        </div>

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
              className="w-full rounded-md border border-[var(--foreground)] bg-[var(--background)] px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm">
              Discount (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0"
              className="w-full rounded-md border border-[var(--foreground)] bg-[var(--background)] px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-[var(--foreground)] bg-[var(--background)] px-4 py-3"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5"
          />
          <label
            htmlFor="isActive"
            className="font-semibold text-sm cursor-pointer select-none"
          >
            Product Active
          </label>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-sm">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a brief description..."
            className="w-full rounded-md border border-[var(--foreground)] bg-[var(--background)] px-4 py-3 min-h-[100px] resize-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-sm">
            Stock by Size
          </label>
          <div className="grid grid-cols-5 gap-3">
            {sizes.map((size) => (
              <div key={size}>
                <label className="block mb-1 font-semibold text-sm">
                  {size}
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={stockBySize[size]}
                  onChange={(e) =>
                    setStockBySize((prev) => ({
                      ...prev,
                      [size]: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  placeholder="0"
                  className="w-full rounded-md border border-[var(--foreground)] bg-[var(--background)] px-3 py-2"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-sm">Images</label>
          {images.map((img, i) => (
            <div
              key={i}
              className="mb-6 border border-[var(--foreground)] rounded p-3 relative min-h-[96px]"
            >
              <div className="flex space-x-2 mb-2">
                <input
                  type="url"
                  value={img.url}
                  onChange={(e) => handleUrlChange(i, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={!!img.file}
                  className={`flex-1 rounded-md border border-[var(--foreground)] bg-[var(--background)] px-4 py-3 ${
                    img.file ? "opacity-50" : ""
                  }`}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(i, e.target.files)}
                  disabled={img.url.trim() !== ""}
                  className={`flex-1 rounded-md border border-[var(--foreground)] bg-[var(--background)] px-4 py-3 cursor-pointer ${
                    img.url.trim() !== "" ? "opacity-50" : ""
                  }`}
                />
              </div>

              {img.preview ? (
                <Image
                  src={img.preview}
                  alt={`Preview ${i + 1}`}
                  width={96}
                  height={96}
                  className="rounded border border-[var(--foreground)] object-contain"
                />
              ) : img.url.trim() !== "" ? (
                <Image
                  src={img.url}
                  alt={`Image ${i + 1}`}
                  width={96}
                  height={96}
                  className="rounded border border-[var(--foreground)] object-contain"
                  onError={(e) => {
                    const target = e.target as unknown as HTMLElement;
                    target.style.display = "none";
                  }}
                />
              ) : null}

              <button
                type="button"
                onClick={() => removeImageInput(i)}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addImageInput}
            className="bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded"
          >
            Add Image
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-3 rounded-md ${
            loading
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-[var(--foreground)] text-[var(--background)]"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
