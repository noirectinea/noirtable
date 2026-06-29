export default function MenuLoading() {
  return (
    <main className="min-h-screen bg-[#e7dfd2] px-6 py-24 text-[#11100d] lg:pl-[168px] lg:pr-16">
      <p className="w-fit border-b border-[#11100d] pb-2 text-[9px] font-semibold uppercase tracking-[0.32em]">
        The menu
      </p>
      <h1 className="mt-6 max-w-xl font-serif text-6xl leading-[0.95] sm:text-7xl">
        The kitchen is setting the list.
      </h1>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-[360px] border border-[#2d261f]/15 bg-[#ded4c5]"
          />
        ))}
      </div>
    </main>
  );
}
