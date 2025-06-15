export default function ContactPage() {
  return (
    <main className="max-w-2xl mt-24 mx-auto px-6 py-24 text-[var(--foreground)] space-y-10 font-sans">
      <h1 className="text-5xl font-semibold tracking-tight">Contact</h1>
      <p className="text-base leading-7 opacity-90">
        For questions, feedback, or collaboration opportunities, feel free to
        reach out.
      </p>
      <div className="space-y-4">
        <div>
          <p className="text-sm opacity-70">Email</p>
          <a
            href="mailto:ahmettutsak@hotmail.com"
            className="text-base underline underline-offset-4 hover:opacity-80 transition"
          >
            ahmettutsak@hotmail.com
          </a>
        </div>
        <div>
          <p className="text-sm opacity-70">GitHub</p>
          <a
            href="https://github.com/ahmettutsak"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base underline underline-offset-4 hover:opacity-80 transition"
          >
            github.com/ahmettutsak
          </a>
        </div>
        <div>
          <p className="text-sm opacity-70">LinkedIn</p>
          <a
            href="https://linkedin.com/in/ahmettutsak"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base underline underline-offset-4 hover:opacity-80 transition"
          >
            linkedin.com/in/ahmettutsak
          </a>
        </div>
      </div>
    </main>
  );
}
