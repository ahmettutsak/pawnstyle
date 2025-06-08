"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-cards";
import { Pagination, Navigation, EffectCards } from "swiper/modules";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <Hero />
      <BestSellers />
      <Seasonal />
      <WhyPAWNSTYLE />
      <Testimonials />
      <Newsletter />
    </div>
  );
}

function Hero() {
  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row items-center lg:justify-between justify-around px-6 lg:px-36">
      <div className="lg:min-w-3xl flex flex-col justify-center items-center lg:items-start gap-4 text-center lg:text-left lg:ml-28">
        <h1 className="text-5xl font-mono font-medium">
          Luxury isn't just for humans.
        </h1>
        <p className="text-lg font-sans text-[var(--gray)]">
          Discover high-end canine fashion designed for comfort, elegance, and
          everyday sophistication.
        </p>
        <div className="bg-[var(--red)] p-4 rounded text-[var(--background)] flex justify-center items-center max-w-52 cursor-pointer shadow-[6px_6px_0px_0px_var(--foreground)]">
          <h1 className="font-sans select-auto">Explore the Collection</h1>
        </div>
      </div>

      <div className="flex justify-center items-center xl:max-h-screen xl:w-full">
        <Image
          src={"/hero.png"}
          width={4000}
          height={4000}
          alt="dog"
          className="object-contain max-h-screen"
        />
      </div>
    </div>
  );
}

function BestSellers() {
  return (
    <div className="min-h-screen flex flex-col mt-32 xl:mt-0">
      <div className="flex justify-center p-0 m-0 w-full relative -z-20">
        <h1 className="lg:text-[200px] text-6xl p-0 font-mono">Best Sellers</h1>
      </div>
      <div className="bg-[var(--background)] grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-8 gap-8 pt-4 pb-12 relative lg:-top-15 -top-5">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}

function Seasonal() {
  return (
    <div className="min-h-screen flex flex-col mt-32 xl:mt-0">
      <div className="flex justify-center items-center p-0 m-0 w-full relative -z-20">
        <h1 className="lg:text-[200px] text-6xl p-0 font-mono">Seasonal</h1>
      </div>
      <div className="bg-[var(--background)] min-h-screen grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 grid-rows-2 gap-4 px-8 py-8 relative lg:-top-15 -top-5">
        <Image
          src={"/spec6.jpg"}
          width={4000}
          height={4000}
          alt="dog"
          className="object-cover row-span-2 w-full h-full rounded-lg"
        />
        <Image
          src={"/spec2.jpg"}
          width={4000}
          height={4000}
          alt="dog"
          className="object-cover w-full h-full rounded-lg"
        />
        <Image
          src={"/spec5.jpg"}
          width={4000}
          height={4000}
          alt="dog"
          className="object-cover w-full h-full row-span-2 rounded-lg"
        />
        <Image
          src={"/spec4.jpg"}
          width={4000}
          height={4000}
          alt="dog"
          className="object-cover w-full h-full rounded-lg"
        />
        <Image
          src={"/spec1.jpg"}
          width={4000}
          height={4000}
          alt="dog"
          className="object-cover w-full  h-full rounded-lg"
        />
        <Image
          src={"/spec7.jpg"}
          width={4000}
          height={4000}
          alt="dog"
          className="object-cover w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
}

function WhyPAWNSTYLE() {
  return (
    <div className="min-h-screen flex flex-col mt-32 xl:mt-0">
      <div className="flex justify-center p-0 m-0 w-full relative -z-20">
        <h1 className="lg:text-[200px] text-6xl p-0 font-mono text-center">
          Pawstyle Quality
        </h1>
      </div>
      <div className="bg-[var(--background)] h-[90vh] flex flex-col lg:flex-row justify-center items-center w-full px-8 xl:pt-8 md:pt-48 pt-96 pb-12 relative lg:-top-15 -top-5">
        <div className="flex flex-col justify-center items-center  p-8 rounded-lg max-w-3xl text-center space-y-4">
          {/* <span className="font-mono text-2xl"></span> */}
          <h1 className="font-sans text-xl">
            🎗️{" "}
            <span className="font-mono font-semibold text-2xl">
              Premium Fabrics
            </span>{" "}
            – Soft fleece, breathable cotton, and waterproof textures ensure
            comfort and durability.
          </h1>
          <h1 className="font-sans text-xl">
            👕{" "}
            <span className="font-mono font-semibold text-2xl">
              Designed for Every Breed
            </span>{" "}
            – Ensuring a snug yet flexible fit for maximum mobility and style.
          </h1>
          <h1 className="font-sans text-xl">
            💎{" "}
            <span className="font-mono font-semibold text-2xl">
              Limited Edition Releases
            </span>{" "}
            – Seasonal drops for those seeking unique, high-fashion pet wear.
          </h1>
          <h1 className="font-sans text-xl">
            🔒{" "}
            <span className="font-mono font-semibold text-2xl">
              Secure Checkout & Fast Shipping
            </span>{" "}
            – Reliable payments, hassle-free ordering, and worldwide delivery.
          </h1>
        </div>
        <div className="flex justify-center items-center">
          <Image
            src={"/why.png"}
            width={4000}
            height={4000}
            alt="pawstyle"
            className="max-w-[750px] w-full h-auto mt-0"
          />
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <div className="flex flex-col md:mt-32 mt-96 xl:mt-0">
      <div className="flex justify-center p-0 m-0 w-full relative -z-20">
        <h1 className="lg:text-[200px] text-6xl p-0 font-mono text-center">
          Style Trusted
        </h1>
      </div>
      <div className="bg-[var(--background)] flex justify-center items-center pt-4 pb-12 relative lg:-top-15 -top-5">
        <Swiper
          modules={[Pagination, Navigation, EffectCards]}
          effect={"cards"}
          grabCursor={true}
          rewind={true}
          slidesPerView={1}
          className="max-w-[150px] sm:max-w-[250px] md:max-w-[400px]"
        >
          <SwiperSlide>
            <TesCard />
          </SwiperSlide>
          <SwiperSlide>
            <TesCard />
          </SwiperSlide>
          <SwiperSlide>
            <TesCard />
          </SwiperSlide>
          <SwiperSlide>
            <TesCard />
          </SwiperSlide>
          <SwiperSlide>
            <TesCard />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

function Newsletter() {
  return (
    <div className="flex flex-col md:mt-32  md:p-12 p-4 xl:mt-0 ">
      <div className="flex justify-center p-0 m-0 w-full relative -z-20">
        <h1 className="lg:text-[200px] text-6xl p-0 font-mono text-center">
          Style Updates
        </h1>
      </div>
      <div className="bg-[var(--red)] shadow-[8px_12px_0px_0px_var(--foreground)] flex justify-center p-12 items-center rounded pt-32 pb-12 relative lg:-top-15 -top-5">
        <div>
          <h1 className="font-mono text-4xl text-center text-[var(--background)]">
            Get early access to exclusive collections & special offers.
          </h1>
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded-lg w-full h-16 mt-12 bg-[var(--background)] font-sans"
          />
          <h1 className="font-sans mt-8 md:text-center text-[var(--background)] opacity-50">
            ✔️ First access to limited editions - ✔️ Special discounts for
            members - ✔️ Exclusive pet fashion tips
          </h1>
          <div className="bg-[var(--foreground)] select-none p-4 rounded text-[var(--background)] flex justify-center shadow-[3px_3px_0px_0px_var(--background)] items-center w-full cursor-pointer mb-12 mt-8">
            <h1>Subscribe Now!</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

function TesCard() {
  return (
    <div>
      <div className="flex flex-col justify-center bg-[var(--background)] items-center border-2 p-4 rounded gap-2">
        <div className="w-full">
          <Image
            src={"/hero.png"}
            width={4000}
            height={4000}
            alt="dog"
            className="max-w-full"
          />
        </div>
        <div className="flex justify-center items-center flex-col w-full gap-1">
          <h1 className="font-mono text-xl">Testimonial Title</h1>
          <p className="font-sans text-sm opacity-70">This is a testimonial.</p>
        </div>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="flex flex-col justify-evenly items-center w-full border-2 p-4 rounded gap-2">
      <div className="w-full">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{
            clickable: true,
          }}
          rewind={true}
          spaceBetween={10}
          slidesPerView={1}
        >
          <SwiperSlide>
            <Image
              src={"/hero.png"}
              width={4000}
              height={4000}
              alt="dog"
              className="max-w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/hero.png"}
              width={4000}
              height={4000}
              alt="dog"
              className="max-w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/hero.png"}
              width={4000}
              height={4000}
              alt="dog"
              className="max-w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/hero.png"}
              width={4000}
              height={4000}
              alt="dog"
              className="max-w-full"
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="flex justify-center items-center flex-col w-full gap-1">
        <div className="flex w-full justify-between font-mono xl:text-2xl text-xl gap-2">
          <h1>Cart Curt Car</h1>
          <h1>$12.00</h1>
        </div>
        <div className="w-full h-1 bg-[var(--gray)] rounded"></div>
        <div className="flex w-full justify-between font-sans opacity-50 xl:text-md mt-2 text-xs">
          <h1>Stars</h1>
          <h1>Count</h1>
        </div>
      </div>
    </div>
  );
}
