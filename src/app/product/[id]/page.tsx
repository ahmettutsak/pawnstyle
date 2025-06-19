"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import { supabase } from "@/lib/supabase/supabase";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type Product = {
  id: number;
  name: string;
  price: number;
  stars: number;
  count: number;
  description: string;
  images: string[];
};

type ProductSize = {
  size: string;
  stock: number;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
};

function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function setCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cart));
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const productId = Number(params.id);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState<string>(searchParams.get("size") || "M");
  const [quantity, setQuantity] = useState<number>(
    Number(searchParams.get("quantity")) || 1
  );
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);

      // Ürün bilgisi çek
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id, name, price, description, images")
        .eq("id", productId)
        .single();

      if (productError || !productData) {
        router.push("/404");
        return;
      }

      // Yorum bilgisi çek
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("stars")
        .eq("product_id", productId);

      if (reviewsError) {
        console.error("Reviews fetch error:", reviewsError);
      }

      let averageStars = 0;
      let reviewsCount = 0;
      if (reviewsData && reviewsData.length > 0) {
        reviewsCount = reviewsData.length;
        averageStars =
          reviewsData.reduce((sum, r) => sum + (r.stars || 0), 0) /
          reviewsCount;
      }

      const productWithReviews: Product = {
        ...productData,
        stars: Math.round(averageStars),
        count: reviewsCount,
      };

      setProduct(productWithReviews);

      // Stokta olan bedenleri çek
      const { data: sizeData, error: sizeError } = await supabase
        .from("product_sizes")
        .select("size, stock")
        .eq("product_id", productId)
        .gt("stock", 0);

      if (sizeError) {
        console.error("Size fetch error:", sizeError);
      }

      setSizes(sizeData || []);
      setLoading(false);
    }

    fetchProduct();
  }, [productId, router]);

  useEffect(() => {
    // Mevcut beden listesinde seçili beden yoksa ilkini kullan
    if (sizes.length > 0 && !sizes.find((s) => s.size === size)) {
      setSize(sizes[0].size);
    }
  }, [sizes]);

  useEffect(() => {
    // URL query param güncelle
    const params = new URLSearchParams(window.location.search);
    params.set("size", size);
    params.set("quantity", quantity.toString());

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [size, quantity, router]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!product) return <p className="text-center py-10">Product not found</p>;

  const handleAddToCart = () => {
    const cart = getCart();
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === size
    );
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        size,
        image: product.images[0],
      });
    }
    setCart(cart);
    window.dispatchEvent(new Event("cartUpdated"));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const renderStars = (count: number) =>
    "★".repeat(count) + "☆".repeat(5 - count);

  return (
    <div className="max-w-7xl mx-auto w-full py-10 mt-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="w-full">
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            rewind={true}
            spaceBetween={10}
            slidesPerView={1}
          >
            {product.images.map((src, idx) => (
              <SwiperSlide key={idx}>
                <Image
                  src={src}
                  alt={product.name}
                  width={3800}
                  height={3800}
                  className="rounded-lg w-full h-auto object-contain"
                  priority={idx === 0}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex flex-col gap-6 md:mt-24">
          <h1 className="text-3xl sm:text-4xl font-mono text-[var(--foreground)] leading-tight">
            {product.name}
          </h1>

          <p className="text-xl sm:text-2xl font-sans text-[var(--foreground)] font-semibold">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-sm font-sans opacity-60">
            {renderStars(product.stars)} ({product.count} reviews)
          </p>

          <div className="h-1 w-full bg-[var(--gray)] rounded" />

          <p className="text-[var(--foreground)] font-sans text-base leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <label htmlFor="size" className="font-mono text-sm">
                Size
              </label>
              <select
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="border border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] px-4 py-2 rounded font-sans w-full sm:w-32"
              >
                {sizes.map((s) => (
                  <option key={s.size} value={s.size}>
                    {s.size}
                  </option>
                ))}
              </select>
              <p className="text-sm text-[var(--foreground)] opacity-70">
                Size Guide: XS (Chihuahua), S (Pomeranian), M (Beagle), L
                (Labrador), XL (Golden Retriever)
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <label htmlFor="quantity" className="font-mono text-sm">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={sizes.find((s) => s.size === size)?.stock || 1}
                value={quantity}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  const maxStock =
                    sizes.find((s) => s.size === size)?.stock || 1;
                  setQuantity(Math.min(newValue, maxStock));
                }}
                className="border border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] px-4 py-2 rounded font-sans w-full sm:w-20"
              />
              <p className="text-sm text-[var(--foreground)] opacity-70">
                Stock available:{" "}
                {sizes.find((s) => s.size === size)?.stock || 0}
              </p>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-6 bg-[var(--foreground)] text-[var(--background)] px-8 py-3 rounded font-mono text-base w-full sm:w-fit"
          >
            Add to Cart
          </button>

          {addedToCart && (
            <p className="text-[var(--foreground)] font-sans mt-2">
              ✅ Added to cart!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
