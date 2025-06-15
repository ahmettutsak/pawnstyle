export default function AboutPage() {
  return (
    <main className="max-w-2xl mt-24 mx-auto px-6 py-24 text-[var(--foreground)] space-y-10 font-sans">
      <h1 className="text-5xl font-semibold tracking-tight">About</h1>
      <p className="text-base leading-7 opacity-90">
        This is not a real store. It's a concept project crafted to showcase
        design, functionality, and clean code.
      </p>
      <p className="text-base leading-7 opacity-90">
        Every page, every interaction, and every detail was built with care
        using Next.js, Tailwind CSS, and modern frontend practices.
      </p>
      <p className="text-base leading-7 opacity-90">
        It's part of my portfolio. A digital shop that doesn't sell, but speaks.
      </p>
      <p className="text-base leading-7 opacity-90">
        Want to talk?{" "}
        <a
          href="/contact"
          className="underline underline-offset-4 hover:opacity-80 transition"
        >
          Reach out here
        </a>
        .
      </p>
    </main>
  );
}
