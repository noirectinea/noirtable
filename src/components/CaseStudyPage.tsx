import Link from "next/link";

const featureGroups = [
  {
    title: "Guest flow",
    items: ["Editorial homepage", "Menu filters", "Dish detail view", "Cart", "Checkout"],
  },
  {
    title: "Restaurant flow",
    items: ["Order storage", "Table requests", "Status filters", "Staff desk"],
  },
  {
    title: "Build",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
];

const projectPages = [
  { href: "/", label: "Restaurant site" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
  { href: "/admin/orders", label: "Staff desk" },
];

export function CaseStudyPage() {
  return (
    <main className="min-h-screen bg-[#241b15] text-[#eee8dc]">
      <header className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-5 sm:px-8 sm:py-7">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.28em] text-white sm:text-sm sm:tracking-[0.44em]"
        >
          Noirtable
        </Link>
        <Link
          href="/admin/orders"
          className="text-[10px] uppercase tracking-[0.26em] text-[#b4a895] hover:text-white sm:text-[11px]"
        >
          Staff desk
        </Link>
      </header>

      <section className="mx-auto grid max-w-[1500px] gap-10 px-4 pb-16 pt-8 sm:px-8 sm:pt-14 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.38em] text-[#c2ad83]">
            Portfolio case study
          </p>
          <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[0.9] text-white sm:text-7xl lg:text-8xl">
            Premium restaurant website with ordering.
          </h1>
        </div>

        <div className="border-y border-[#6a4f39] py-6 lg:py-8">
          <p className="max-w-2xl text-sm leading-7 text-[#cdbb9d] sm:text-base sm:leading-8">
            Noirtable is a portfolio project for a small premium restaurant:
            editorial brand presence, online ordering, table requests, and a
            staff desk for the evening service.
          </p>
          <div className="mt-8 grid gap-3 text-[10px] uppercase tracking-[0.24em] text-[#8f806b] sm:grid-cols-3">
            <span>Dark editorial identity</span>
            <span>Working order flow</span>
            <span>Restaurant operations</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-5 px-4 pb-16 sm:px-8 lg:grid-cols-3">
        {featureGroups.map((group) => (
          <article
            key={group.title}
            className="border border-[#4a382b] bg-[#2b2119] px-5 py-6"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#c2ad83]">
              {group.title}
            </p>
            <div className="mt-8 grid gap-4">
              {group.items.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b border-[#4a382b] pb-3 text-sm text-[#d0c6b8]"
                >
                  <span>{item}</span>
                  <span className="h-px w-8 bg-[#6a4f39]" />
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-8 border-y border-[#6a4f39] px-4 py-12 sm:px-8 lg:grid-cols-[0.68fr_1.32fr]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#c2ad83]">
            What was built
          </p>
          <h2 className="mt-4 max-w-sm font-serif text-4xl leading-none text-white sm:text-6xl">
            A complete guest-to-staff flow.
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="border-l border-[#6a4f39] pl-5">
            <p className="font-serif text-3xl text-white">Guest side</p>
            <p className="mt-4 text-sm leading-7 text-[#a79b88]">
              Guests browse dishes, open a detail view, add quantities, review
              the cart, choose delivery or pickup, and place an order.
            </p>
          </div>
          <div className="border-l border-[#6a4f39] pl-5">
            <p className="font-serif text-3xl text-white">Staff side</p>
            <p className="mt-4 text-sm leading-7 text-[#a79b88]">
              The staff desk receives orders and reservations, filters orders by
              status, and moves each order through the service flow.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-8 px-4 py-14 sm:px-8 lg:grid-cols-[1fr_0.75fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {projectPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="quiet-lift border border-[#4a382b] bg-[#2b2119] px-5 py-5 text-[10px] uppercase tracking-[0.26em] text-[#d0c6b8] hover:border-[#e4d3b3] hover:text-white"
            >
              {page.label}
            </Link>
          ))}
        </div>

        <aside className="border-y border-[#6a4f39] py-6">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#c2ad83]">
            Portfolio note
          </p>
          <p className="mt-5 text-sm leading-7 text-[#a79b88]">
            This project is built to demonstrate both visual direction and
            product thinking: the restaurant has a public experience, a checkout
            flow, and an operational screen for staff.
          </p>
        </aside>
      </section>
    </main>
  );
}
