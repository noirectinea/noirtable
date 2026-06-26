"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { menuItems, type MenuItem } from "@/data/menu";
import { formatPrice, useCart } from "@/lib/cart";

type MenuSection = "Starters" | "Mains" | "Pasta" | "Sides" | "Desserts" | "Drinks";

type FullMenuEntry = {
  index: number;
  section: MenuSection;
  itemId: number;
  badge?: string;
  image: string;
  displayTime?: string;
};

const sectionOrder: MenuSection[] = [
  "Starters",
  "Mains",
  "Pasta",
  "Sides",
  "Desserts",
  "Drinks",
];

const fullMenuEntries: FullMenuEntry[] = [
  { index: 1, section: "Starters", itemId: 1, badge: "Fresh", image: "/images/menu-generated/menu-01.png", displayTime: "10 min" },
  { index: 2, section: "Starters", itemId: 2, badge: "Chef pick", image: "/images/menu-generated/menu-02.png", displayTime: "12 min" },
  { index: 3, section: "Starters", itemId: 3, image: "/images/menu-generated/menu-03.png", displayTime: "9 min" },
  { index: 4, section: "Starters", itemId: 4, image: "/images/menu-generated/menu-04.png", displayTime: "12 min" },
  { index: 5, section: "Mains", itemId: 14, image: "/images/menu-generated/menu-05.png", displayTime: "24 min" },
  { index: 6, section: "Mains", itemId: 15, image: "/images/menu-generated/menu-06.png", displayTime: "30 min" },
  { index: 7, section: "Mains", itemId: 16, image: "/images/menu-generated/menu-07.png", displayTime: "19 min" },
  { index: 8, section: "Mains", itemId: 17, badge: "Premium", image: "/images/menu-generated/menu-08.png", displayTime: "27 min" },
  { index: 9, section: "Pasta", itemId: 18, badge: "Chef pick", image: "/images/menu-generated/menu-09.png", displayTime: "22 min" },
  { index: 10, section: "Pasta", itemId: 19, image: "/images/menu-generated/menu-10.png", displayTime: "20 min" },
  { index: 11, section: "Pasta", itemId: 20, image: "/images/menu-generated/menu-11.png", displayTime: "20 min" },
  { index: 12, section: "Pasta", itemId: 51, image: "/images/menu-generated/menu-12.png", displayTime: "18 min" },
  { index: 13, section: "Sides", itemId: 52, image: "/images/menu-generated/menu-13.png", displayTime: "8 min" },
  { index: 14, section: "Sides", itemId: 53, image: "/images/menu-generated/menu-14.png", displayTime: "8 min" },
  { index: 15, section: "Sides", itemId: 54, image: "/images/menu-generated/menu-15.png", displayTime: "9 min" },
  { index: 16, section: "Sides", itemId: 55, image: "/images/menu-generated/menu-16.png", displayTime: "-" },
  { index: 17, section: "Desserts", itemId: 56, image: "/images/menu-generated/menu-17.png", displayTime: "10 min" },
  { index: 18, section: "Desserts", itemId: 57, image: "/images/menu-generated/menu-18.png", displayTime: "10 min" },
  { index: 19, section: "Desserts", itemId: 39, image: "/images/menu-generated/menu-19.png", displayTime: "12 min" },
  { index: 20, section: "Desserts", itemId: 58, image: "/images/menu-generated/menu-20.png", displayTime: "8 min" },
  { index: 21, section: "Drinks", itemId: 59, image: "/images/menu-generated/menu-21.png", displayTime: "5 min" },
  { index: 22, section: "Drinks", itemId: 60, image: "/images/menu-generated/menu-22.png", displayTime: "5 min" },
  { index: 23, section: "Drinks", itemId: 61, image: "/images/menu-generated/menu-23.png", displayTime: "5 min" },
  { index: 24, section: "Drinks", itemId: 50, image: "/images/menu-generated/menu-24.png", displayTime: "2 min" },
];

function getItem(entry: FullMenuEntry) {
  const item = menuItems.find((menuItem) => menuItem.id === entry.itemId);

  if (!item) {
    throw new Error(`Missing menu item ${entry.itemId}`);
  }

  return item;
}

function slugSection(section: string) {
  return section.toLowerCase().replace(/\s+/g, "-");
}

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
        <a className="relative font-bold" href="#top">
          <span className="absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#11100d]" />
          Menu
        </a>
        <Link href="/#reserve">Reserve</Link>
        <Link href="/case-study">Journal</Link>
        <Link href="/#room">About</Link>
      </nav>

      <p className="absolute bottom-20 left-1/2 -translate-x-1/2 -rotate-90 whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.36em] text-[#1c1712]">
        Private room
      </p>
    </aside>
  );
}

function FullMenuCard({
  entry,
  item,
  onView,
}: {
  entry: FullMenuEntry;
  item: MenuItem;
  onView: (entry: FullMenuEntry) => void;
}) {
  return (
    <article className="border border-[#2d261f]/18 bg-[#e7dfd2]">
      <button
        type="button"
        onClick={() => onView(entry)}
        className="relative block h-[154px] w-full overflow-hidden border-b border-[#2d261f]/15 text-left"
        aria-label={`View ${item.name}`}
      >
        <Image
          src={entry.image}
          alt={item.name}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 44vw, 100vw"
          className="object-cover"
        />
      </button>

      <div className="px-4 py-4">
        <div className="flex flex-wrap items-center gap-3 text-[7px] font-semibold uppercase tracking-[0.24em] text-[#11100d]/56">
          <span>{String(entry.index).padStart(2, "0")}</span>
          <span>{entry.section}</span>
          {entry.badge ? (
            <span className="border border-[#2d261f]/22 px-2 py-1 text-[7px] text-[#11100d]/72">
              {entry.badge}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 min-h-[48px] font-serif text-2xl leading-none text-[#11100d]">
          {item.name}
        </h3>
        <p className="mt-4 text-[8px] font-semibold uppercase tracking-[0.24em] text-[#11100d]/66">
          {entry.displayTime ?? item.prepTime}
        </p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="text-sm text-[#11100d]">{formatPrice(item.price)}</p>
          <button
            type="button"
            onClick={() => onView(entry)}
            className="border-b border-[#11100d] pb-1 text-[8px] font-semibold uppercase tracking-[0.28em] text-[#11100d]"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}

function DetailModal({
  entry,
  item,
  onClose,
  onAdd,
}: {
  entry: FullMenuEntry | null;
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (item: MenuItem) => void;
}) {
  useEffect(() => {
    if (!entry) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [entry]);

  if (!entry || !item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-end bg-[#11100d]/35 px-3 py-3 sm:place-items-center sm:px-6">
      <button
        type="button"
        aria-label="Close dish detail"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <article className="relative grid w-full max-w-3xl border border-[#2d261f]/20 bg-[#e7dfd2] sm:grid-cols-[1fr_1fr]">
        <div className="relative min-h-[260px] border-b border-[#2d261f]/15 sm:min-h-[420px] sm:border-b-0 sm:border-r">
          <Image
            src={entry.image}
            alt={item.name}
            fill
            sizes="(min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="grid content-between gap-10 px-5 py-6 sm:px-7 sm:py-8">
          <div>
            <div className="flex items-start justify-between gap-4">
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#11100d]/56">
                {entry.section}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center border border-[#2d261f]/22 text-sm text-[#11100d]"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <h3 className="mt-8 font-serif text-5xl leading-[0.92] text-[#11100d]">
              {item.name}
            </h3>
            <p className="mt-6 text-sm leading-7 text-[#11100d]/68">
              {item.description}
            </p>
          </div>

          <div>
            <div className="grid grid-cols-3 border-y border-[#2d261f]/15 py-4 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#11100d]/58">
              <span>{formatPrice(item.price)}</span>
              <span className="text-center">{entry.displayTime ?? item.prepTime}</span>
              <span className="text-right">{entry.badge ?? "Order"}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onAdd(item);
                onClose();
              }}
              className="mt-5 h-12 w-full bg-[#c2a16e] text-[9px] font-semibold uppercase tracking-[0.3em] text-[#11100d] transition hover:bg-[#b9935f]"
            >
              Add to order
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export function FullMenuPage() {
  const [selectedEntry, setSelectedEntry] = useState<FullMenuEntry | null>(null);
  const { addItem, itemCount } = useCart();

  const selectedItem = selectedEntry ? getItem(selectedEntry) : null;
  const groupedEntries = useMemo(
    () =>
      sectionOrder.map((section) => ({
        section,
        entries: fullMenuEntries.filter((entry) => entry.section === section),
      })),
    [],
  );

  return (
    <main id="top" className="min-h-screen overflow-x-clip bg-[#e7dfd2] text-[#11100d]">
      <Sidebar />

      <DetailModal
        entry={selectedEntry}
        item={selectedItem}
        onClose={() => setSelectedEntry(null)}
        onAdd={addItem}
      />

      <div className="lg:pl-[104px]">
        <header className="grid gap-12 border-b border-[#2d261f]/15 px-6 pb-8 pt-8 lg:grid-cols-[1fr_auto] lg:px-16 lg:pb-10">
          <div>
            <Link
              href="/"
              className="text-[9px] font-semibold uppercase tracking-[0.36em] lg:hidden"
            >
              Noirtable
            </Link>
            <p className="mt-12 w-fit border-b border-[#11100d] pb-2 text-[9px] font-semibold uppercase tracking-[0.32em] lg:mt-0">
              The menu
            </p>
            <h1 className="mt-8 max-w-xl font-serif text-6xl leading-[0.95] text-[#11100d] sm:text-7xl">
              Six tables.
              <br />
              Late plates.
              <br />
              Quiet service.
            </h1>
            <span className="mt-10 block h-px w-24 bg-[#2d261f]/20" />
            <p className="mt-8 max-w-[310px] text-sm leading-7 text-[#11100d]/68">
              A small kitchen, a short list,
              <br />
              and the time to do it right.
            </p>
          </div>

          <Link
            href="/#reserve"
            className="h-fit justify-self-start border border-[#11100d]/45 px-7 py-5 text-[9px] font-semibold uppercase tracking-[0.32em] transition hover:bg-[#11100d] hover:text-[#e7dfd2] lg:justify-self-end"
          >
            Reserve
          </Link>
        </header>

        <section className="grid gap-8 border-b border-[#2d261f]/15 px-6 py-8 lg:grid-cols-[1fr_auto] lg:px-16">
          <nav className="flex gap-8 overflow-x-auto text-[8px] font-semibold uppercase tracking-[0.32em] text-[#11100d]">
            <a className="border-b border-[#11100d] pb-2" href="#top">
              All
            </a>
            {sectionOrder.map((section) => (
              <a key={section} className="pb-2" href={`#${slugSection(section)}`}>
                {section}
              </a>
            ))}
          </nav>
          <p className="max-w-[260px] text-xs leading-6 text-[#11100d]/66 lg:text-right">
            Kitchen closes late.
            <br />
            Last order 30 minutes before close.
          </p>
        </section>

        <div className="px-6 py-8 lg:px-16">
          {groupedEntries.map(({ section, entries }) => (
            <section
              key={section}
              id={slugSection(section)}
              className="scroll-mt-6 pb-8"
            >
              <h2 className="border-b border-[#2d261f]/15 pb-3 text-[9px] font-semibold uppercase tracking-[0.36em]">
                {section}
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {entries.map((entry) => (
                  <FullMenuCard
                    key={entry.index}
                    entry={entry}
                    item={getItem(entry)}
                    onView={setSelectedEntry}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-[#2d261f]/15 px-6 py-9 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#11100d] lg:px-16">
          <span>Noirtable</span>
          <nav className="flex flex-wrap gap-7">
            <Link href="/cart">Cart {itemCount}</Link>
            <Link href="/#reserve">Reserve</Link>
            <Link href="/admin/orders">Staff desk</Link>
            <Link href="/case-study">Case study</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
