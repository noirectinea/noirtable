import Image from "next/image";
import Link from "next/link";

const flowCards = [
  {
    eyebrow: "01  Guest path",
    title: "Menu to cart",
    text: "The public flow moves from editorial restaurant pages into a practical menu, dish view, quantity controls, and a clean cart.",
    href: "/menu",
    action: "Open menu",
  },
  {
    eyebrow: "02  Checkout",
    title: "Data and pseudo payment",
    text: "Checkout collects guest details, service method, address notes, and a simulated payment step for a complete portfolio order journey.",
    href: "/checkout",
    action: "Open checkout",
  },
  {
    eyebrow: "03  Operations",
    title: "Staff desk",
    text: "Orders and table requests land in a staff-facing desk with statuses, service timing, and a compact view for the evening team.",
    href: "/staff",
    action: "Open staff desk",
  },
];

const buildNotes = [
  "Editorial homepage",
  "Filtered menu",
  "Cart state",
  "Guest data form",
  "Pseudo payment",
  "Staff order desk",
];

function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-[104px] border-r border-[#2d261f]/15 bg-[#e7dfd2] lg:block">
      <Link
        href="/"
        className="absolute left-0 right-0 top-10 text-center text-[9px] font-semibold uppercase tracking-[0.42em] text-[#15120f]"
      >
        Noirtable
      </Link>

      <nav className="absolute left-0 right-0 top-[22vh] grid gap-7 text-center text-[8px] font-semibold uppercase tracking-[0.32em] text-[#1c1712]">
        <Link href="/#room">Room</Link>
        <Link href="/menu">Menu</Link>
        <Link href="/#reserve">Reserve</Link>
        <Link href="/case-study">Journal</Link>
        <Link href="/cart">Cart</Link>
      </nav>

      <p className="absolute bottom-20 left-1/2 -translate-x-1/2 -rotate-90 whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.36em] text-[#1c1712]">
        Case study
      </p>
    </aside>
  );
}

export function CaseStudyPage() {
  return (
    <main className="min-h-screen bg-[#e7dfd2] text-[#11100d]">
      <Sidebar />

      <div className="lg:pl-[104px]">
        <section className="relative grid min-h-screen overflow-hidden border-b border-[#2d261f]/15 px-6 py-8 sm:px-10 lg:grid-cols-[42%_58%] lg:px-0 lg:py-0">
          <Image
            src="/images/hero/noirtable-room.jpg"
            alt="Noirtable dining room"
            fill
            priority
            sizes="100vw"
            quality={72}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#e7dfd2]/70" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(231,223,210,0.96)_0%,rgba(231,223,210,0.82)_42%,rgba(231,223,210,0.34)_100%)]" />

          <header className="absolute left-6 right-6 top-8 z-10 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.34em] text-[#17130f] sm:left-10 sm:right-10 lg:left-16 lg:right-16">
            <Link href="/">Noirtable</Link>
            <Link href="/staff">Staff desk</Link>
          </header>

          <div className="relative z-10 flex min-h-screen flex-col justify-center pb-14 pt-28 lg:px-16">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#9b7c4d]">
              Portfolio case study
            </p>
            <h1 className="mt-6 max-w-xl font-serif text-6xl leading-[0.9] text-[#11100d] sm:text-7xl lg:text-8xl">
              Restaurant site with ordering.
            </h1>
            <p className="mt-8 max-w-md text-sm leading-7 text-[#1f1a15]/72 sm:text-base">
              A premium Noirtable experience: editorial dining room, full menu,
              cart, guest checkout with pseudo payment, and a staff desk for
              service.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/cart"
                className="bg-[#cfaa6d] px-8 py-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#17130f]"
              >
                Cart
              </Link>
              <Link
                href="/checkout"
                className="border border-[#2d261f]/25 px-8 py-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#17130f]"
              >
                Checkout
              </Link>
            </div>
          </div>

          <div className="relative z-10 hidden min-h-screen items-end justify-end p-16 lg:flex">
            <div className="w-[320px] border border-[#2d261f]/18 bg-[#e7dfd2]/76 p-7 backdrop-blur-sm">
              <div className="flex justify-between border-b border-[#2d261f]/14 pb-5 text-[8px] font-semibold uppercase tracking-[0.3em] text-[#1f1a15]/58">
                <span>Build</span>
                <span>Guest flow</span>
              </div>
              <p className="mt-7 text-sm leading-7 text-[#1f1a15]/70">
                The page now presents the project as part of the same beige
                luxury restaurant system instead of a separate dark portfolio.
              </p>
              <div className="mt-8 flex items-end justify-between border-t border-[#2d261f]/14 pt-5">
                <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#1f1a15]/58">
                  Noirtable
                </span>
                <span className="font-serif text-3xl">NT</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid border-b border-[#2d261f]/15 lg:min-h-screen lg:grid-cols-[36%_64%]">
          <div className="flex flex-col justify-center border-b border-[#2d261f]/15 px-6 py-16 sm:px-10 lg:border-b-0 lg:border-r lg:px-16">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/58">
              Product flow
            </p>
            <h2 className="mt-8 max-w-sm font-serif text-5xl leading-[0.95] sm:text-6xl">
              From table mood to paid order.
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-7 text-[#1f1a15]/68">
              The case study is built around the real restaurant journey:
              choosing food, entering guest data, confirming a pseudo payment,
              and handing the order to staff.
            </p>
          </div>

          <div className="grid content-center gap-5 p-6 sm:p-10 lg:p-16">
            {flowCards.map((card) => (
              <article
                key={card.title}
                className="grid gap-6 border border-[#2d261f]/16 bg-[#e7dfd2] p-6 sm:grid-cols-[0.7fr_1fr_auto] sm:items-center"
              >
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#1f1a15]/50">
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-4 font-serif text-3xl leading-none">
                    {card.title}
                  </h3>
                </div>
                <p className="text-sm leading-7 text-[#1f1a15]/68">
                  {card.text}
                </p>
                <Link
                  href={card.href}
                  className="w-fit border-b border-[#11100d] pb-1 text-[8px] font-semibold uppercase tracking-[0.28em] text-[#11100d]"
                >
                  {card.action}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="grid border-b border-[#2d261f]/15 lg:min-h-[70vh] lg:grid-cols-[46%_54%]">
          <div className="relative min-h-[300px] border-b border-[#2d261f]/15 sm:min-h-[360px] lg:min-h-[70vh] lg:border-b-0 lg:border-r">
            <Image
              src="/images/case-study/order-system-detail.jpg"
              alt="Restaurant ordering interface mood"
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              quality={72}
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/58">
              What is included
            </p>
            <h2 className="mt-6 max-w-[420px] font-serif text-4xl leading-[0.96] sm:text-5xl">
              Cart, forms, payment screen, staff desk.
            </h2>

            <div className="mt-8 grid gap-0 border-y border-[#2d261f]/15">
              {buildNotes.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b border-[#2d261f]/12 py-3 last:border-b-0"
                >
                  <span className="text-sm text-[#1f1a15]/74">{item}</span>
                  <span className="h-px w-8 bg-[#2d261f]/28" />
                </div>
              ))}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Link
                href="/cart"
                className="border border-[#2d261f]/18 px-5 py-4 text-center text-[8px] font-semibold uppercase tracking-[0.26em]"
              >
                Cart
              </Link>
              <Link
                href="/checkout"
                className="border border-[#2d261f]/18 px-5 py-4 text-center text-[8px] font-semibold uppercase tracking-[0.26em]"
              >
                Payment
              </Link>
              <Link
                href="/staff"
                className="border border-[#2d261f]/18 px-5 py-4 text-center text-[8px] font-semibold uppercase tracking-[0.26em]"
              >
                Staff
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
