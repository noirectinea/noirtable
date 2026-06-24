"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  menuCategories,
  menuItems,
  type MenuCategory,
  type MenuItem,
} from "@/data/menu";
import { formatPrice, useCart } from "@/lib/cart";

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M7 8h13l-1.6 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.7L5.8 5.9H3" />
      <path d="M9 20.5h.01M17 20.5h.01" />
    </svg>
  );
}

function FloatingTopCart({
  itemCount,
  subtotal,
  isVisible,
}: {
  itemCount: number;
  subtotal: number;
  isVisible: boolean;
}) {
  return (
    <Link
      href="/cart"
      className={`fixed bottom-4 left-4 right-4 z-50 grid grid-cols-[auto_1fr] items-center gap-3 border border-[#d9b982]/80 bg-[#080503]/88 px-4 py-3 text-[#f0e4d2] shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-md transition duration-500 hover:bg-[#d9b982] hover:text-black md:bottom-auto md:left-auto md:right-5 md:top-20 md:w-auto ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0 md:-translate-y-2"
      }`}
      aria-label={`Open cart with ${itemCount} items`}
    >
      <span className="grid h-11 w-11 place-items-center border border-current/35">
        <CartIcon />
      </span>
      <span className="grid gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-[0.24em]">
          Cart · {itemCount}
        </span>
        <span className="font-serif text-2xl leading-none">
          {formatPrice(subtotal)}
        </span>
      </span>
    </Link>
  );
}

function QuantityControl({
  item,
  quantity,
  onAdd,
  onRemove,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onRemove: (itemId: number) => void;
}) {
  if (quantity === 0) {
    return (
      <button
        onClick={() => onAdd(item)}
        className="h-8 border border-[#6f6558] px-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#eee8dc] transition hover:border-white hover:bg-white hover:text-black"
      >
        Add
      </button>
    );
  }

  return (
    <div className="grid h-8 w-24 grid-cols-3 border border-[#6f6558] text-center text-[#eee8dc]">
      <button
        onClick={() => onRemove(item.id)}
        className="text-sm transition hover:bg-white hover:text-black"
        aria-label={`Remove one ${item.name}`}
      >
        -
      </button>
      <span className="grid place-items-center text-[10px]">{quantity}</span>
      <button
        onClick={() => onAdd(item)}
        className="text-sm transition hover:bg-white hover:text-black"
        aria-label={`Add one ${item.name}`}
      >
        +
      </button>
    </div>
  );
}

function DishDetailModal({
  item,
  quantity,
  onClose,
  onAdd,
  onRemove,
}: {
  item: MenuItem | null;
  quantity: number;
  onClose: () => void;
  onAdd: (item: MenuItem) => void;
  onRemove: (itemId: number) => void;
}) {
  if (!item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-end bg-black/70 px-3 py-3 backdrop-blur-sm sm:place-items-center sm:px-6">
      <button
        type="button"
        aria-label="Close dish details"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <article className="relative grid w-full max-w-3xl overflow-hidden border border-[#d9b982]/35 bg-[#241b15] shadow-[0_28px_90px_rgba(0,0,0,0.62)] sm:grid-cols-[0.92fr_1fr]">
        <div className="relative min-h-[260px] sm:min-h-[440px]">
          <Image
            src={item.image ?? "/images/generated-dishes/pasta.png"}
            alt={item.name}
            fill
            sizes="(min-width: 640px) 40vw, 100vw"
            className="object-cover opacity-82 saturate-[0.82]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(9,6,4,0.8),transparent_55%)]" />
            <p className="absolute bottom-4 left-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#d9b982]">
              {item.category}
            </p>
            {item.badge ? (
              <p className="absolute right-4 top-4 border border-[#d9b982]/45 bg-[#241b15]/70 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#ead8b8] backdrop-blur-sm">
                {item.badge}
              </p>
            ) : null}
          </div>

        <div className="grid content-between gap-10 px-5 py-6 sm:px-7 sm:py-8">
          <div>
            <div className="flex items-start justify-between gap-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#8f7d68]">
                Order detail
              </p>
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center border border-[#34251b] text-sm text-[#d8ccb8] transition hover:border-white hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <h3 className="mt-7 max-w-sm font-serif text-4xl leading-[0.92] text-white sm:text-5xl">
              {item.name}
            </h3>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#c8b295]">
              {item.description}
            </p>
          </div>

          <div>
            <div className="grid grid-cols-3 border-y border-[#2d2118] py-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8f7d68]">
              <span>{formatPrice(item.price)}</span>
              <span className="text-center">{item.prepTime}</span>
              <span className="text-right">{item.badge ?? "Pickup"}</span>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#d9b982]">
                Add to order
              </span>
              <QuantityControl
                item={item}
                quantity={quantity}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export function FoodOrderingPage() {
  const [activeCategory, setActiveCategory] = useState<"All" | MenuCategory>("All");
  const [search, setSearch] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasReachedAbout, setHasReachedAbout] = useState(false);
  const [hasReachedMenu, setHasReachedMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [reservationName, setReservationName] = useState("");
  const [reservationPhone, setReservationPhone] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [reservationParty, setReservationParty] = useState("2 guests");
  const [reservationStatus, setReservationStatus] = useState("");
  const [isReservationSubmitting, setIsReservationSubmitting] = useState(false);
  const [lastAdded, setLastAdded] = useState<MenuItem | null>(null);
  const { items, addItem, removeItem, itemCount, subtotal } = useCart();
  const featuredMenuIndexes = new Set([0, 5, 11, 18, 27, 36]);

  useEffect(() => {
    function updateScrollProgress() {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setScrollProgress(
        scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0,
      );

      const aboutSection = document.getElementById("about");
      const menuSection = document.getElementById("menu");
      const triggerLine = window.innerHeight * 0.42;

      setHasReachedAbout(
        aboutSection ? aboutSection.getBoundingClientRect().top <= triggerLine : false,
      );
      setHasReachedMenu(
        menuSection ? menuSection.getBoundingClientRect().top <= triggerLine : false,
      );
    }

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        query.length === 0 ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  function getQuantity(itemId: number) {
    return items.find((item) => item.id === itemId)?.quantity ?? 0;
  }

  function isFeaturedDish(index: number) {
    return featuredMenuIndexes.has(index);
  }

  function handleAddItem(item: MenuItem) {
    addItem(item);
    setLastAdded(item);
  }

  useEffect(() => {
    if (!lastAdded) {
      return;
    }

    const timer = window.setTimeout(() => setLastAdded(null), 2200);

    return () => window.clearTimeout(timer);
  }, [lastAdded]);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedItem]);

  async function submitReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsReservationSubmitting(true);
    setReservationStatus("");

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName: reservationName,
          phone: reservationPhone,
          preferredTime: reservationTime,
          partySize: reservationParty,
          note: "Asked from the website reservation form.",
        }),
      });

      const result = (await response.json()) as {
        reservationId?: string;
        message?: string;
      };

      if (!response.ok) {
        setReservationStatus(result.message ?? "Request rejected.");
        return;
      }

      setReservationName("");
      setReservationPhone("");
      setReservationTime("");
      setReservationParty("2 guests");
      setReservationStatus(
        `${result.reservationId} is on the evening list. We will call to confirm.`,
      );
    } catch {
      setReservationStatus("Reservation service unavailable.");
    } finally {
      setIsReservationSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[#241b15] text-[#f0e4d2]">
      <div className="fixed left-0 right-0 top-0 z-[60] h-px bg-[#24160f]">
        <div
          className="h-full origin-left bg-[#d9b982]"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      <nav
        className={`fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 gap-4 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#8e755d] transition duration-500 xl:grid ${
          hasReachedAbout
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <a className="transition hover:text-white" href="#">
          Room
        </a>
        <span className="h-10 w-px bg-[#4b3222]" />
        <a className="transition hover:text-white" href="#menu">
          Menu
        </a>
        <span className="h-10 w-px bg-[#4b3222]" />
        <a className="transition hover:text-white" href="#reserve">
          Table
        </a>
      </nav>

      <a
        href="#menu"
        className={`fixed bottom-24 right-4 z-50 grid h-11 w-11 place-items-center border border-[#d9b982]/50 bg-[#080503]/78 text-[#f0e4d2] shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-500 hover:bg-[#d9b982] hover:text-black md:bottom-5 md:right-5 ${
          hasReachedMenu
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
        aria-label="Back to menu filters"
      >
        ↑
      </a>

      <FloatingTopCart
        itemCount={itemCount}
        subtotal={subtotal}
        isVisible={hasReachedMenu}
      />

      <DishDetailModal
        item={selectedItem}
        quantity={selectedItem ? getQuantity(selectedItem.id) : 0}
        onClose={() => setSelectedItem(null)}
        onAdd={handleAddItem}
        onRemove={removeItem}
      />

      <div
        className={`fixed left-4 right-4 top-20 z-[70] border border-[#d9b982]/45 bg-[#241b15]/92 px-4 py-3 text-[#f0e4d2] shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-500 sm:left-auto sm:right-8 sm:w-80 ${
          lastAdded
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        role="status"
      >
        <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#d9b982]">
          Added to order
        </p>
        <p className="mt-1 text-sm text-white">{lastAdded?.name}</p>
      </div>

      <section className="relative isolate min-h-screen overflow-hidden bg-[#241b15]">
        <header className="absolute left-0 right-0 top-0 z-20 mx-auto grid max-w-[1540px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start px-4 py-5 sm:px-8 sm:py-6">
          <nav className="col-start-1 hidden gap-7 pt-2 text-[9px] font-semibold uppercase tracking-[0.26em] text-[#c9aa7c] md:flex">
            <a href="#menu" className="transition hover:text-white">
              Menu
            </a>
            <a href="#reserve" className="transition hover:text-white">
              Reserve
            </a>
          </nav>

          <Link href="/" className="col-start-2 justify-self-center text-center">
            <span className="block font-serif text-[14px] tracking-[0.18em] text-white sm:text-[16px] sm:tracking-[0.22em]">
              Noirtable
            </span>
            <span className="mx-auto mt-2 block h-px w-16 bg-[#d9b982]/55" />
            <span className="mt-2 block text-[8px] uppercase tracking-[0.28em] text-[#c9aa7c]">
              Dining room
            </span>
          </Link>

          <a
            href="#reserve"
            className="quiet-lift col-start-3 inline-flex justify-self-end border border-[#d0ae77]/60 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#f0e4d2] transition hover:bg-[#d0ae77] hover:text-black sm:px-4 sm:py-3 sm:text-[10px] sm:tracking-[0.2em]"
          >
            Reserve
          </a>
        </header>

        <Image
          src="/images/hero/lounge.png"
          alt="Candlelit luxury restaurant lounge"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-90 saturate-[0.94]"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_48%_44%,rgba(233,204,158,0.16),transparent_34%),linear-gradient(0deg,rgba(32,24,19,0.78),rgba(32,24,19,0.16)_48%,rgba(32,24,19,0.42)),linear-gradient(90deg,rgba(32,24,19,0.52),transparent_40%,rgba(32,24,19,0.54))]" />
        <div className="candle-dust pointer-events-none absolute inset-0 -z-10" />
        <div className="absolute bottom-8 left-4 hidden origin-left -rotate-90 text-[8px] font-semibold uppercase tracking-[0.34em] text-[#e1c389]/70 sm:block">
          private room / warm service / late kitchen
        </div>
        <div className="absolute bottom-8 right-8 hidden h-24 w-px bg-[#e1c389]/35 md:block" />

        <div className="mx-auto flex min-h-[92vh] max-w-[1540px] items-end px-4 pb-24 pt-28 sm:min-h-screen sm:px-8 sm:pb-28">
          <div className="grid w-full gap-10 md:grid-cols-[1fr_300px] md:items-end">
            <div className="text-left">
              <p className="max-w-xs text-[8px] font-semibold uppercase tracking-[0.42em] text-[#d0ae77]">
                Small room / late kitchen / tables by phone
              </p>
              <h1 className="mt-4 font-serif text-6xl leading-[0.9] tracking-[0.005em] text-white sm:text-8xl lg:text-[9.5rem]">
                Noirtable
              </h1>
              <div className="mt-7 grid max-w-xl gap-4 border-t border-[#d0ae77]/40 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <p className="max-w-sm text-xs leading-6 text-[#e7d3b0] sm:text-sm">
                  A warm room, a short menu, and plates prepared for late
                  tables.
                </p>
                <a
                  href="#menu"
                  className="quiet-lift inline-flex w-fit border border-[#d0ae77] bg-[#d0ae77] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-black shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition hover:bg-[#ead7b4] sm:px-10 sm:py-5 sm:text-[11px]"
                >
                  Choose a plate
                </a>
              </div>
            </div>

            <aside className="hidden self-end border-l border-[#d0ae77]/30 pl-5 pb-2 text-[#e2cfad] md:block">
              <div className="flex items-start justify-between border-b border-[#d0ae77]/25 pb-4 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#d0ae77]">
                <span>Tonight</span>
                <span>19:00-late</span>
              </div>
              <p className="mt-5 max-w-[250px] text-[13px] leading-6 text-[#ead8b8]">
                Six tables, a short pickup window, and a kitchen kept small
                enough to stay precise.
              </p>
              <div className="mt-8 grid grid-cols-[1fr_auto] items-end border-t border-[#d0ae77]/25 pt-4">
                <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#9f8d76]">
                  Main room
                </p>
                <p className="font-serif text-4xl leading-none tracking-[0.01em] text-[#d0ae77]/80">
                  NT
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="about" className="soft-reveal mx-auto max-w-[1540px] px-4 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="grid content-between border-y border-[#614b39] bg-[#2b2119] px-4 py-6 sm:px-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#d9b982]">
              The room
            </p>
            <div className="mt-12 sm:mt-16">
              <h2 className="max-w-md font-serif text-3xl leading-[1] text-white sm:text-5xl">
                Six tables, dinner nightly.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-[#c8b295]">
                Opened in 2019. Seasonal plates, low light, and reservations
                confirmed quietly by phone.
              </p>
              <dl className="mt-10 grid gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9d8669] sm:max-w-md">
                <div className="flex justify-between border-b border-[#614b39]/60 pb-2">
                  <dt>Opened</dt>
                  <dd>2019</dd>
                </div>
                <div className="flex justify-between border-b border-[#614b39]/60 pb-2">
                  <dt>Dinner</dt>
                  <dd>Nightly</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Room</dt>
                  <dd>Six tables</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden border border-[#614b39] bg-[#17110d] sm:min-h-[520px]">
            <Image
              src="/images/hero/about-room.png"
              alt="Warm restaurant interior"
              fill
              sizes="100vw"
              className="object-cover opacity-84 saturate-[0.88] transition duration-500 hover:scale-[1.015] hover:opacity-90"
            />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,4,3,0.72),transparent_46%),linear-gradient(90deg,rgba(7,4,3,0.46),transparent_48%)]" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between border-t border-[#d9b982]/30 pt-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#d9b982]">
              <span>Main room</span>
              <span>Opened 2019</span>
            </div>
          </div>
        </div>
      </section>

      <section className="soft-reveal mx-auto max-w-[1540px] px-4 pb-10 sm:px-8 sm:pb-14">
        <div className="grid gap-5 border-y border-[#5a4737] py-8 text-[#c7ad87] lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <p className="max-w-xl font-serif text-3xl leading-[0.98] text-white sm:text-5xl">
            Six tables. Late plates. Quiet service.
          </p>
          <div className="grid gap-4 text-[9px] font-semibold uppercase tracking-[0.22em] sm:grid-cols-3 sm:text-[10px]">
            <span>Pickup after 19:00</span>
            <span>Delivery nearby</span>
            <a href="#reserve" className="hover:text-white">
              Book by phone
            </a>
          </div>
        </div>
      </section>

      <section id="menu" className="soft-reveal relative isolate mx-auto max-w-[1540px] px-4 pb-28 sm:px-8 sm:pb-14">
        <div className="candle-dust pointer-events-none absolute inset-x-0 top-0 -z-10 h-2/3" />
        <div className="menu-embers pointer-events-none absolute inset-x-0 top-8 -z-10 h-[88%]" />
        <div className="grid gap-6 border-b border-[#5a4737] pb-5 lg:grid-cols-[0.55fr_1.45fr] lg:items-end">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#918677]">
              Evening menu
            </p>
            <h2 className="mt-3 font-serif text-3xl uppercase leading-none tracking-[0.04em] text-white sm:text-4xl">
              Plates to order
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#aa9678]">
              A short list. Built around the market, the room, and the hour.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex gap-2 overflow-x-auto">
              {menuCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`quiet-lift shrink-0 border px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] transition ${
                    activeCategory === category
                      ? "border-[#d8ccb8] bg-[#d8ccb8] text-black"
                      : "border-[#302820] text-[#918677] hover:border-white hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="w-full border-b border-[#302820] bg-transparent py-3 text-xs text-white outline-none placeholder:text-[#6f6558] focus:border-white"
            />
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredItems.map((item, index) => (
            <article
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedItem(item)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedItem(item);
                }
              }}
              className={`quiet-lift group relative grid min-h-[148px] cursor-pointer grid-cols-[124px_minmax(0,1fr)] border border-[#6a523e] bg-[#30251c] transition duration-300 hover:border-[#d0ae77]/65 hover:bg-[#382b21] sm:block ${
                isFeaturedDish(index)
                  ? "lg:col-span-2 sm:min-h-[410px]"
                  : "sm:min-h-[368px]"
              }`}
            >
              <div
                className={`relative m-3 aspect-square min-h-0 overflow-hidden bg-[#1d1510] shadow-[inset_0_0_0_1px_rgba(208,174,119,0.08),0_18px_60px_rgba(0,0,0,0.18)] sm:m-0 sm:aspect-auto sm:min-h-0 ${
                  isFeaturedDish(index) ? "sm:h-60" : "sm:h-48"
                }`}
              >
                <Image
                  src={item.image ?? "/images/generated-dishes/pasta.png"}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92px"
                  className="object-cover opacity-88 grayscale-[5%] saturate-[0.92] transition duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </div>

              <div className="hidden px-4 pt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9d8669] sm:flex sm:justify-between">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <button
                  type="button"
                  className="text-[#9d8669] transition group-hover:text-[#d0ae77]"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedItem(item);
                  }}
                >
                  View
                </button>
              </div>

              <div className="sr-only">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="grid min-w-0 content-between py-4 pr-4 sm:min-h-[178px] sm:px-5 sm:pb-16 sm:pt-5">
                <div>
                  <div className="flex items-start justify-between gap-4 sm:block">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#9d8669] sm:text-[9px]">
                          {item.category}
                        </p>
                        {item.badge ? (
                          <p className="border border-[#d0ae77]/40 px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.18em] text-[#d0ae77] sm:text-[8px]">
                            {item.badge}
                          </p>
                        ) : null}
                      </div>
                      <h3 className={`font-menu mt-1 [overflow-wrap:anywhere] leading-[0.94] text-white ${isFeaturedDish(index) ? "text-3xl sm:text-4xl" : "text-2xl sm:text-[31px]"}`}>
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#d8ccb8] sm:hidden">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="mt-3 line-clamp-2 max-w-lg text-xs leading-5 text-[#aa9678]">
                    {item.description}
                  </p>
                  <p className="mt-3 hidden text-[11px] uppercase tracking-[0.18em] text-[#b99f7b] sm:block">
                    {item.prepTime}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#7f715f] sm:hidden">
                    View dish
                  </span>
                  <p className="hidden text-sm text-[#d8ccb8] sm:block">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>

              <div
                className="absolute bottom-4 right-4 sm:right-4"
                onClick={(event) => event.stopPropagation()}
              >
                <QuantityControl
                  item={item}
                  quantity={getQuantity(item.id)}
                  onAdd={handleAddItem}
                  onRemove={removeItem}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="reserve"
        className="mx-auto grid max-w-[1540px] gap-5 px-4 pb-28 sm:px-8 sm:pb-14 lg:grid-cols-12"
      >
        <div className="border-y border-[#614b39] bg-[#2b2119] px-4 py-6 sm:px-6 lg:col-span-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#918677]">
            Reservations
          </p>
          <h2 className="mt-4 max-w-sm font-serif text-3xl uppercase leading-[0.96] tracking-[0.04em] text-white sm:text-4xl">
            A table request,
            <br />
            kept simple.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#9f8d76]">
            Send a name, a number, and the hour you have in mind. The room
            confirms every table by phone.
          </p>
        </div>
        <form
          onSubmit={submitReservation}
          className="grid gap-3 border border-[#614b39] bg-[#2b2119] p-4 sm:grid-cols-2 sm:p-5 lg:col-span-7"
        >
          <input
            value={reservationName}
            onChange={(event) => setReservationName(event.target.value)}
            placeholder="Name"
            className="border border-[#302820] bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-[#6f6558] focus:border-[#d8ccb8]"
          />
          <input
            value={reservationPhone}
            onChange={(event) => setReservationPhone(event.target.value)}
            placeholder="Phone"
            className="border border-[#302820] bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-[#6f6558] focus:border-[#d8ccb8]"
          />
          <input
            value={reservationTime}
            onChange={(event) => setReservationTime(event.target.value)}
            placeholder="Preferred time"
            className="border border-[#302820] bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-[#6f6558] focus:border-[#d8ccb8]"
          />
          <input
            value={reservationParty}
            onChange={(event) => setReservationParty(event.target.value)}
            placeholder="Party size"
            className="border border-[#302820] bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-[#6f6558] focus:border-[#d8ccb8]"
          />
          <button
            disabled={isReservationSubmitting}
            className="quiet-lift border border-[#d8ccb8] bg-[#d8ccb8] px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-white disabled:opacity-60 sm:col-span-2"
          >
            {isReservationSubmitting ? "Sending" : "Request a table"}
          </button>
          {reservationStatus ? (
            <p className="border border-[#302820] px-4 py-3 text-xs leading-5 text-[#c8b295] sm:col-span-2">
              {reservationStatus}
            </p>
          ) : null}
        </form>
      </section>

      <footer className="mx-auto flex max-w-[1540px] flex-wrap items-center justify-between gap-4 border-t border-[#614b39] px-5 py-7 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9d8669] sm:px-8">
        <span>Noirtable</span>
        <nav className="flex flex-wrap gap-5">
          <Link href="/cart" className="hover:text-white">
            Cart {itemCount}
          </Link>
          <a href="#reserve" className="hover:text-white">
            Reserve
          </a>
          <Link href="/admin/orders" className="hover:text-white">
            Staff desk
          </Link>
          <Link href="/case-study" className="hover:text-white">
            Case study
          </Link>
        </nav>
      </footer>
    </main>
  );
}
