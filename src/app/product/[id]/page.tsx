"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const mockProducts = [
  {
    id: 1,
    name: "Cozy Dog Sweater",
    price: 25.99,
    stars: 4.7,
    count: 120,
    description:
      "A warm and stylish sweater to keep your dog cozy during chilly walks.",
    images: ["/hero.png", "/hero.png", "/hero.png"],
  },
  {
    id: 2,
    name: "Raincoat for Dogs",
    price: 30.0,
    stars: 4.2,
    count: 89,
    description:
      "Water-resistant and lightweight. Perfect for rainy day adventures.",
    images: ["/hero.png", "/hero.png", "/hero.png"],
  },
];

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const productId = Number(params.id);
  const product = mockProducts.find((p) => p.id === productId);

  const [size, setSize] = useState<string>("M");
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  if (!product) return notFound();

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

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
            {product.stars} ★ ({product.count} reviews)
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
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <label htmlFor="quantity" className="font-mono text-sm">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] px-4 py-2 rounded font-sans w-full sm:w-20"
              />
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

      <div className="mt-16">
        <h2 className="text-2xl font-mono text-[var(--foreground)] mb-6">
          You might also like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mockProducts
            .filter((p) => p.id !== product.id)
            .map((related) => (
              <div
                key={related.id}
                className="flex flex-col justify-evenly items-center w-full border-2 p-4 rounded gap-2"
              >
                <div className="w-full">
                  <Image
                    src={related.images[0]}
                    alt={related.name}
                    width={800}
                    height={800}
                    className="rounded w-full h-auto object-contain"
                    priority
                  />
                </div>
                <div className="flex justify-between w-full font-mono text-lg mt-2">
                  <h3>{related.name}</h3>
                  <p>${related.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
