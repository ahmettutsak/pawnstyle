import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Hero />
      <BestSellers />
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
    <div className="h-screen flex flex-col mt-32 xl:mt-0">
      <div className="flex justify-center p-0 m-0 w-full relative -z-20">
        <h1 className="lg:text-[200px] text-6xl p-0 font-mono">Best Sellers</h1>
      </div>
      <div className="bg-[var(--background)] grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 h-screen w-full px-8 gap-8 relative lg:-top-15 -top-5 pt-4">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="flex flex-col justify-evenly items-center max-h-screen w-full border-2 p-4 rounded gap-2">
      <Image
        src={"/hero.png"}
        width={4000}
        height={4000}
        alt="dog"
        className="max-w-full"
      />
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
