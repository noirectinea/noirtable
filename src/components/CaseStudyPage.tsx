"use client";

import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { NoirtableMark } from "@/components/NoirtableMark";
import { StableImageFrame } from "@/components/StableImageFrame";

const projectMeta = [
  ["Project type", "Small restaurant website"],
  ["Role", "Design, frontend, cart, staff view"],
  ["Stack", "Next.js, Vercel, Supabase"],
  ["Includes", "Menu, cart, checkout, staff desk"],
];

const buildNotes = [
  "Homepage",
  "Dinner menu",
  "Cart",
  "Guest form",
  "Checkout",
  "Staff desk",
];

const staffFeatures = [
  "Order status",
  "Reservation status",
  "Item list",
  "Guest details",
  "Staff actions",
];

const journeySteps = [
  ["01 Menu", "Guest picks a plate"],
  ["02 Cart", "The order is checked"],
  ["03 Checkout", "Name, phone, and timing"],
  ["04 Success", "The kitchen has it"],
  ["05 Staff desk", "The room sees the order"],
];

const journalNotes = [
  [
    "The room first",
    "The site had to feel like a table was already set. The order flow comes later, quietly.",
  ],
  [
    "No app noise",
    "Cart, checkout, and status buttons stay plain. Nothing shouts over the food.",
  ],
  [
    "Staff after service starts",
    "The back room view is there for the evening team: who ordered, who called, what is next.",
  ],
];

const workingFeatures = [
  ["Menu", "Dishes load from Supabase, with a printed-menu fallback."],
  ["Cart", "Quantities update in place and stay in the browser."],
  ["Checkout", "Pickup or delivery details create an order."],
  ["Reservations", "Table requests land beside the evening orders."],
  ["Staff desk", "The team can accept, prepare, complete, or decline."],
  ["Menu records", "Staff can keep the working menu tidy without code."],
];

function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-[104px] border-r border-[#2d261f]/15 bg-[#e7dfd2] lg:block">
      <div className="absolute left-0 right-0 top-10 grid justify-items-center gap-3 text-[#15120f]">
        <Link
          href="/"
          className="text-center text-[9px] font-semibold uppercase tracking-[0.42em]"
        >
          Noirtable
        </Link>
        <NoirtableMark className="h-6 w-6" />
      </div>

      <nav className="absolute left-0 right-0 top-[22vh] grid gap-7 text-center text-[8px] font-semibold uppercase tracking-[0.32em] text-[#1c1712]">
        <Link href="/#room">Room</Link>
        <Link href="/menu">Menu</Link>
        <Link href="/#reserve">Reserve</Link>
        <Link href="/case-study">Journal</Link>
        <Link href="/#room">About</Link>
      </nav>

      <p className="absolute bottom-20 left-1/2 -translate-x-1/2 -rotate-90 whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.36em] text-[#1c1712]">
        Journal
      </p>
    </aside>
  );
}

export function CaseStudyPage() {
  return (
    <main className="min-h-screen bg-[#e7dfd2] text-[#11100d]">
      <Sidebar />
      <MobileNav
        links={[
          { href: "/#room", label: "Room" },
          { href: "/menu", label: "Menu" },
          { href: "/cart", label: "Cart" },
          { href: "/staff", label: "Staff" },
        ]}
      />

      <div className="lg:pl-[104px]">
        <section
          className="relative grid min-h-svh overflow-hidden border-b border-[#2d261f]/15 px-6 pb-8 pt-20 sm:px-10 sm:py-8 lg:min-h-screen lg:grid-cols-[44%_56%] lg:px-0 lg:py-0"
          style={{ overflow: "hidden", position: "relative" }}
        >
          <StableImageFrame
            src="/images/hero/noirtable-room.jpg"
            alt="Noirtable dining room"
            className="object-cover"
            style={{
              height: "100%",
              inset: 0,
              position: "absolute",
              width: "100%",
            }}
          />
          <div className="absolute inset-0 bg-[#e7dfd2]/72" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(231,223,210,0.97)_0%,rgba(231,223,210,0.88)_45%,rgba(231,223,210,0.44)_100%)]" />

          <header className="absolute left-6 right-6 top-16 z-10 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.34em] text-[#17130f] sm:left-10 sm:right-10 sm:top-8 lg:left-16 lg:right-16">
            <Link href="/">Noirtable</Link>
            <Link href="/staff">Staff desk</Link>
          </header>

          <div className="relative z-10 flex min-h-[calc(100svh-112px)] flex-col justify-center pb-14 pt-28 lg:min-h-screen lg:px-16">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#9b7c4d]">
              Journal
            </p>
            <h1 className="mt-6 max-w-xl font-serif text-6xl leading-[0.9] text-[#11100d] sm:text-7xl lg:text-8xl">
              A small room that also takes orders.
            </h1>
            <p className="mt-8 max-w-md text-sm leading-7 text-[#1f1a15]/72 sm:text-base">
              Notes on building Noirtable: a dinner menu, a cart, checkout, and
              a staff desk without making the place feel like an app.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="bg-[#cfaa6d] px-8 py-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#17130f]"
              >
                View menu
              </Link>
              <Link
                href="/staff"
                className="border border-[#2d261f]/25 px-8 py-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#17130f]"
              >
                Staff desk
              </Link>
            </div>
          </div>

          <div className="relative z-10 hidden min-h-screen items-end justify-end p-16 lg:flex">
            <div className="w-[420px] border-y border-[#2d261f]/16 bg-[#e7dfd2]/78 py-2 backdrop-blur-sm">
              {projectMeta.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[140px_1fr] gap-5 border-b border-[#2d261f]/14 py-5 last:border-b-0"
                >
                  <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#1f1a15]/52">
                    {label}
                  </span>
                  <span className="text-sm leading-6 text-[#1f1a15]/72">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#2d261f]/15 px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[34%_66%]">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/58">
                Notes
              </p>
              <h2 className="mt-7 max-w-sm font-serif text-5xl leading-[0.96]">
                What had to feel right.
              </h2>
            </div>
            <div className="grid gap-0 border-y border-[#2d261f]/15">
              {journalNotes.map(([title, text], index) => (
                <div
                  key={title}
                  className="grid gap-4 border-b border-[#2d261f]/12 py-5 last:border-b-0 sm:grid-cols-[80px_1fr]"
                >
                  <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#1f1a15]/46">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-3xl leading-none">
                      {title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-[#1f1a15]/68">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid border-b border-[#2d261f]/15 lg:grid-cols-[38%_62%]">
          <div className="border-b border-[#2d261f]/15 px-6 py-14 sm:px-10 lg:border-b-0 lg:border-r lg:px-16 lg:py-20">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/58">
              Try it
            </p>
            <h2 className="mt-7 max-w-md font-serif text-5xl leading-[0.96]">
              Start with a plate. Then check the back room.
            </h2>
            <p className="mt-7 max-w-md text-sm leading-7 text-[#1f1a15]/68">
              Add a dish, send the order, then open the staff desk. The point is
              simple: guests stay in the restaurant world, staff still get the
              list they need.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="bg-[#cfaa6d] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.3em]"
              >
                View menu
              </Link>
              <Link
                href="/staff"
                className="border border-[#2d261f]/18 px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.3em]"
              >
                Staff desk
              </Link>
            </div>
          </div>

          <div className="px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/58">
              What works now
            </p>
            <div className="mt-8 grid gap-0 border-y border-[#2d261f]/15">
              {workingFeatures.map(([label, text]) => (
                <div
                  key={label}
                  className="grid gap-3 border-b border-[#2d261f]/12 py-4 last:border-b-0 sm:grid-cols-[150px_1fr]"
                >
                  <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#1f1a15]/55">
                    {label}
                  </span>
                  <span className="text-sm leading-7 text-[#1f1a15]/70">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid border-b border-[#2d261f]/15 lg:grid-cols-2">
          <div className="border-b border-[#2d261f]/15 px-6 py-14 sm:px-10 lg:border-b-0 lg:border-r lg:px-16 lg:py-20">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/58">
              The problem
            </p>
            <h2 className="mt-7 max-w-md font-serif text-5xl leading-[0.96]">
              Ordering can pull you out of the room.
            </h2>
            <p className="mt-7 max-w-md text-sm leading-7 text-[#1f1a15]/68">
              Many restaurant order pages feel like delivery apps: bright
              buttons, loud cards, and none of the place left in them.
            </p>
          </div>

          <div className="px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/58">
              The answer
            </p>
            <h2 className="mt-7 max-w-md font-serif text-5xl leading-[0.96]">
              Keep the order in the same room.
            </h2>
            <p className="mt-7 max-w-md text-sm leading-7 text-[#1f1a15]/68">
              The menu, cart, checkout, and staff desk use the same language as
              the dining room: quiet, direct, and not in a hurry.
            </p>
          </div>
        </section>

        <section className="grid border-b border-[#2d261f]/15 lg:min-h-[66vh] lg:grid-cols-[46%_54%]">
          <div
            className="relative min-h-[300px] border-b border-[#2d261f]/15 sm:min-h-[360px] lg:min-h-[66vh] lg:border-b-0 lg:border-r"
            style={{ minHeight: 300, overflow: "hidden", position: "relative" }}
          >
            <StableImageFrame
              src="/images/case-study/order-system-detail.jpg"
              alt="Restaurant ordering interface mood"
              className="object-cover"
              style={{
                height: "100%",
                inset: 0,
                position: "absolute",
                width: "100%",
              }}
            />
          </div>

          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-12">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/58">
              What is included
            </p>
            <h2 className="mt-6 max-w-[410px] font-serif text-4xl leading-[0.96] sm:text-[3.25rem]">
              The bits behind the dinner.
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
                Checkout
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

        <section className="grid border-b border-[#2d261f]/15 lg:grid-cols-[42%_58%]">
          <div className="border-b border-[#2d261f]/15 px-6 py-14 sm:px-10 lg:border-b-0 lg:border-r lg:px-16 lg:py-20">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/58">
              Staff desk
            </p>
            <h2 className="mt-7 max-w-md font-serif text-5xl leading-[0.96]">
              A list for the people working tonight.
            </h2>
            <p className="mt-7 max-w-md text-sm leading-7 text-[#1f1a15]/68">
              Orders and table requests land where the team can see them:
              confirm, prepare, finish, move on.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/staff"
                className="bg-[#cfaa6d] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.3em]"
              >
                Open staff desk
              </Link>
              <Link
                href="/cart"
                className="border border-[#2d261f]/18 px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.3em]"
              >
                Open cart
              </Link>
            </div>
          </div>

          <div className="grid content-center px-6 py-10 sm:px-10 lg:px-16">
            <div className="grid gap-0 border-y border-[#2d261f]/15">
              {staffFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center justify-between border-b border-[#2d261f]/12 py-5 last:border-b-0"
                >
                  <span className="font-serif text-3xl leading-none">
                    {feature}
                  </span>
                  <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#1f1a15]/52">
                    Staff
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#2d261f]/15 px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[30%_70%]">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/58">
                Service path
              </p>
              <h2 className="mt-7 max-w-sm font-serif text-5xl leading-[0.96]">
                From menu to the room.
              </h2>
            </div>
            <div className="grid gap-0 border-y border-[#2d261f]/15">
              {journeySteps.map(([label, text]) => (
                <div
                  key={label}
                  className="grid gap-3 border-b border-[#2d261f]/12 py-5 last:border-b-0 sm:grid-cols-[180px_1fr]"
                >
                  <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#1f1a15]/55">
                    {label}
                  </span>
                  <span className="font-serif text-3xl leading-none">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          <div className="border-y border-[#2d261f]/15 py-12 text-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/58">
              Noirtable
            </p>
            <h2 className="mx-auto mt-7 max-w-3xl font-serif text-5xl leading-[0.96] sm:text-6xl">
              The guest sees a calm menu. The staff sees what they need. That is
              the whole point.
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/menu"
                className="bg-[#cfaa6d] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.3em]"
              >
                View menu
              </Link>
              <Link
                href="/cart"
                className="border border-[#2d261f]/18 px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.3em]"
              >
                View cart
              </Link>
              <Link
                href="/staff"
                className="border border-[#2d261f]/18 px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.3em]"
              >
                Open staff desk
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
