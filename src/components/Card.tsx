"use client";

import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface CardProps {
  images: string[];
  name: string;
  price: number;
  stars: number | string;
  count: number;
}

export default function Card({ images, name, price, stars, count }: CardProps) {
  return (
    <div className="flex flex-col justify-evenly items-center w-full border-2 p-4 rounded gap-2">
      <div className="w-full">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true }}
          rewind={true}
          spaceBetween={10}
          slidesPerView={1}
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <Image
                src={src}
                width={4000}
                height={4000}
                alt={name}
                className="max-w-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex justify-center items-center flex-col w-full gap-1">
        <div className="flex w-full justify-between font-mono xl:text-2xl text-xl gap-2">
          <h1>{name}</h1>
          <h1>${price.toFixed(2)}</h1>
        </div>
        <div className="w-full h-1 bg-[var(--gray)] rounded"></div>
        <div className="flex w-full justify-between font-sans opacity-50 xl:text-md mt-2 text-xs">
          <h1>{stars}</h1>
          <h1>{count}</h1>
        </div>
      </div>
    </div>
  );
}
