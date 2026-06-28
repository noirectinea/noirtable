"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { menuItems, type MenuItem } from "@/data/menu";
import { formatPrice, useCart } from "@/lib/cart";
import { NoirtableMark } from "@/components/NoirtableMark";

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

function CartLineIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 18 18"
      className="h-3.5 w-3.5"
      fill="none"
    >
      <path
        d="M3 4.75h1.85l1.05 6.1h7.1l1.05-4.2H5.25"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M7 14.25h.01M12.5 14.25h.01"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

const fullMenuEntries: FullMenuEntry[] = [
  { index: 1, section: "Starters", itemId: 1, badge: "Fresh", image: "/images/menu-card-fast/dish-01-oyster-royale.jpg", displayTime: "10 min" },
  { index: 2, section: "Starters", itemId: 2, badge: "Chef pick", image: "/images/menu-card-fast/dish-02-truffle-beef-tartare.jpg", displayTime: "12 min" },
  { index: 3, section: "Starters", itemId: 3, image: "/images/menu-card-fast/dish-03-burrata-noir.jpg", displayTime: "9 min" },
  { index: 4, section: "Starters", itemId: 4, image: "/images/menu-card-fast/dish-04-charred-octopus.jpg", displayTime: "12 min" },
  { index: 5, section: "Mains", itemId: 14, image: "/images/menu-card-fast/dish-05-gold-leaf-risotto.jpg", displayTime: "24 min" },
  { index: 6, section: "Mains", itemId: 15, image: "/images/menu-card-fast/dish-06-lamb-crown.jpg", displayTime: "30 min" },
  { index: 7, section: "Mains", itemId: 16, image: "/images/menu-card-fast/dish-07-noir-burger.jpg", displayTime: "19 min" },
  { index: 8, section: "Mains", itemId: 17, badge: "Premium", image: "/images/menu-card-fast/dish-08-private-table-steak.jpg", displayTime: "27 min" },
  { index: 9, section: "Pasta", itemId: 18, badge: "Chef pick", image: "/images/menu-card-fast/dish-09-saffron-lobster-pasta.jpg", displayTime: "22 min" },
  { index: 10, section: "Pasta", itemId: 19, image: "/images/menu-card-fast/dish-10-porcini-tagliatelle.jpg", displayTime: "20 min" },
  { index: 11, section: "Pasta", itemId: 20, image: "/images/menu-card-fast/dish-11-short-rib-pappardelle.jpg", displayTime: "20 min" },
  { index: 12, section: "Pasta", itemId: 51, image: "/images/menu-card-fast/dish-12-cacio-e-pepe.jpg", displayTime: "18 min" },
  { index: 13, section: "Sides", itemId: 52, image: "/images/menu-card-fast/dish-13-broccolini.jpg", displayTime: "8 min" },
  { index: 14, section: "Sides", itemId: 53, image: "/images/menu-card-fast/dish-14-roasted-mushrooms.jpg", displayTime: "8 min" },
  { index: 15, section: "Sides", itemId: 54, image: "/images/menu-card-fast/dish-15-truffle-fries.jpg", displayTime: "9 min" },
  { index: 16, section: "Sides", itemId: 55, image: "/images/menu-card-fast/dish-16-house-bread.jpg", displayTime: "-" },
  { index: 17, section: "Desserts", itemId: 56, image: "/images/menu-card-fast/dish-17-dark-chocolate-torte.jpg", displayTime: "10 min" },
  { index: 18, section: "Desserts", itemId: 57, image: "/images/menu-card-fast/dish-18-panna-cotta.jpg", displayTime: "10 min" },
  { index: 19, section: "Desserts", itemId: 39, image: "/images/menu-card-fast/dish-19-tiramisu-24k.jpg", displayTime: "12 min" },
  { index: 20, section: "Desserts", itemId: 58, image: "/images/menu-card-fast/dish-20-seasonal-gelato.jpg", displayTime: "8 min" },
  { index: 21, section: "Drinks", itemId: 59, image: "/images/menu-card-fast/dish-21-reserve-negroni.jpg", displayTime: "5 min" },
  { index: 22, section: "Drinks", itemId: 60, image: "/images/menu-card-fast/dish-22-white-by-the-glass.jpg", displayTime: "5 min" },
  { index: 23, section: "Drinks", itemId: 61, image: "/images/menu-card-fast/dish-23-red-by-the-glass.jpg", displayTime: "5 min" },
  { index: 24, section: "Drinks", itemId: 50, image: "/images/menu-card-fast/dish-24-reserve-water.jpg", displayTime: "2 min" },
];

function getItem(entry: FullMenuEntry) {
  const item = menuItems.find((menuItem) => menuItem.id === entry.itemId);

  if (!item) {
    throw new Error(`Missing menu item ${entry.itemId}`);
  }

  return item;
}

function getDetailImage(image: string) {
  return image.replace("/images/menu-card-fast/", "/images/menu-dishes-fast/");
}

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
  onAdd,
  onRemove,
  quantity,
}: {
  entry: FullMenuEntry;
  item: MenuItem;
  onView: (entry: FullMenuEntry) => void;
  onAdd: (item: MenuItem) => void;
  onRemove: (itemId: number) => void;
  quantity: number;
}) {
  return (
    <article className="border border-[#2d261f]/18 bg-[#e7dfd2] transition-colors duration-300 hover:border-[#2d261f]/32">
      <button
        type="button"
        onClick={() => onView(entry)}
        className="menu-card-image-wrap relative"
        style={{
          aspectRatio: "16 / 9",
          display: "block",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
        aria-label={`View ${item.name}`}
      >
        <img
          src={item.image ?? entry.image}
          alt={item.name}
          width={1200}
          height={675}
          loading={entry.index <= 4 ? "eager" : "lazy"}
          decoding={entry.index <= 4 ? "sync" : "async"}
          fetchPriority={entry.index <= 4 ? "high" : "auto"}
          className="menu-card-image transition-opacity duration-300 hover:opacity-90"
          style={{
            display: "block",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            width: "100%",
          }}
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onView(entry)}
              className="border-b border-[#11100d] pb-1 text-[8px] font-semibold uppercase tracking-[0.28em] text-[#11100d] transition-colors duration-300 hover:border-[#9b7c4d] hover:text-[#9b7c4d]"
            >
              View
            </button>
            {quantity > 0 ? (
              <div className="flex h-8 items-center border border-[#2d261f]/18 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#11100d]">
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="grid h-full w-8 place-items-center transition-colors duration-300 hover:bg-[#d7c09a]"
                  aria-label={`Remove one ${item.name}`}
                >
                  -
                </button>
                <span className="min-w-7 border-x border-[#2d261f]/12 px-2 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onAdd(item)}
                  className="grid h-full w-8 place-items-center transition-colors duration-300 hover:bg-[#d7c09a]"
                  aria-label={`Add one ${item.name}`}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onAdd(item)}
                className="border border-[#2d261f]/18 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.24em] text-[#11100d] transition-colors duration-300 hover:bg-[#d7c09a]"
              >
                Add
              </button>
            )}
          </div>
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
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#11100d]/45 px-3 py-4 sm:px-6 sm:py-8">
      <button
        type="button"
        aria-label="Close dish detail"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <article className="relative grid max-h-[calc(100dvh-32px)] w-full max-w-[860px] overflow-y-auto border border-[#2d261f]/20 bg-[#e7dfd2] shadow-2xl shadow-[#11100d]/30 sm:max-h-[620px] sm:grid-cols-[46%_54%] sm:overflow-hidden">
        <div
          className="dish-modal-image-wrap relative"
          style={{ minHeight: 260, overflow: "hidden", position: "relative" }}
        >
          <img
            src={getDetailImage(item.image ?? entry.image)}
            alt={item.name}
            width={1600}
            height={1600}
            loading="eager"
            decoding="sync"
            className="dish-modal-image"
            style={{
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
            }}
          />
        </div>
        <div className="grid content-between gap-10 px-5 py-6 sm:min-h-[500px] sm:px-7 sm:py-8">
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
  const [activeSection, setActiveSection] = useState<"All" | MenuSection>("All");
  const { addItem, removeItem, items, itemCount } = useCart();

  const selectedItem = selectedEntry ? getItem(selectedEntry) : null;
  const visibleEntries = useMemo(
    () =>
      activeSection === "All"
        ? fullMenuEntries
        : fullMenuEntries.filter((entry) => entry.section === activeSection),
    [activeSection],
  );
  const quantitiesById = useMemo(
    () =>
      new Map(
        items.map((item) => [item.id, item.quantity] as const),
      ),
    [items],
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
        <div className="fixed bottom-5 right-5 z-50 flex gap-2 lg:bottom-auto lg:right-16 lg:top-6">
          <Link
            href="/cart"
            className="inline-flex h-[54px] items-center gap-2 border border-[#11100d]/60 bg-[#e7dfd2]/96 px-6 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#11100d] transition-colors duration-300 hover:bg-[#d7c09a]"
          >
            <CartLineIcon />
            {itemCount > 0 ? `Cart ${itemCount}` : "Cart"}
          </Link>
        </div>

        <header className="border-b border-[#2d261f]/15 px-6 pb-6 pt-6 lg:px-16 lg:pb-7">
          <div>
            <Link
              href="/"
              className="text-[9px] font-semibold uppercase tracking-[0.36em] lg:hidden"
            >
              Noirtable
            </Link>
            <p className="mt-10 w-fit border-b border-[#11100d] pb-2 text-[9px] font-semibold uppercase tracking-[0.32em] lg:mt-0">
              The menu
            </p>
            <h1 className="mt-6 max-w-xl font-serif text-6xl leading-[0.95] text-[#11100d] sm:text-7xl">
              Six tables.
              <br />
              Late plates.
              <br />
              Quiet service.
            </h1>
            <span className="mt-7 block h-px w-24 bg-[#2d261f]/20" />
            <p className="mt-6 max-w-[310px] text-sm leading-7 text-[#11100d]/68">
              A small kitchen, a short list,
              <br />
              and the time to do it right.
            </p>
          </div>

        </header>

        <section className="grid gap-8 border-b border-[#2d261f]/15 px-6 py-8 lg:grid-cols-[1fr_auto] lg:px-16">
          <nav className="flex gap-8 overflow-x-auto text-[8px] font-semibold uppercase tracking-[0.32em] text-[#11100d]">
            <button
              type="button"
              onClick={() => setActiveSection("All")}
              className={`pb-2 transition-colors duration-300 hover:text-[#9b7c4d] ${activeSection === "All" ? "border-b border-[#11100d] text-[#11100d]" : "text-[#11100d]/58"}`}
            >
              All
            </button>
            {sectionOrder.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`pb-2 transition-colors duration-300 hover:text-[#9b7c4d] ${activeSection === section ? "border-b border-[#11100d] text-[#11100d]" : "text-[#11100d]/58"}`}
              >
                {section}
              </button>
            ))}
          </nav>
          <p className="max-w-[260px] text-xs leading-6 text-[#11100d]/66 lg:text-right">
            Kitchen closes late.
            <br />
            Last order 30 minutes before close.
          </p>
        </section>

        <div className="px-6 py-8 lg:px-16">
          <h2 className="border-b border-[#2d261f]/15 pb-3 text-[9px] font-semibold uppercase tracking-[0.36em]">
            {activeSection === "All" ? "All dishes" : activeSection}
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {visibleEntries.map((entry) => (
              <FullMenuCard
                key={entry.index}
                entry={entry}
                item={getItem(entry)}
                onView={setSelectedEntry}
                onAdd={addItem}
                onRemove={removeItem}
                quantity={quantitiesById.get(entry.itemId) ?? 0}
              />
            ))}
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-[#2d261f]/15 px-6 py-9 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#11100d] lg:px-16">
          <span>Noirtable</span>
          <nav className="flex flex-wrap gap-7">
            <Link href="/cart">{itemCount > 0 ? `Cart ${itemCount}` : "Cart"}</Link>
            <Link href="/#reserve">Reserve</Link>
            <Link href="/staff">Staff desk</Link>
            <Link href="/case-study">Case study</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
