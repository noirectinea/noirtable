"use client";

export default function MenuError({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#e7dfd2] px-6 text-[#11100d]">
      <section className="max-w-xl border border-[#2d261f]/15 p-8">
        <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#11100d]/56">
          The menu
        </p>
        <h1 className="mt-6 font-serif text-5xl leading-none">
          The printed list is not ready.
        </h1>
        <p className="mt-5 text-sm leading-7 text-[#11100d]/66">
          Try opening the menu again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 border border-[#2d261f]/22 px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.3em] transition-colors duration-300 hover:bg-[#d7c09a]"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
