"use client";

import Link from "next/link";
import { formatPrice, useCart } from "@/lib/cart";

export function CartPage() {
  const { items, itemCount, subtotal, addItem, removeItem, clearCart } =
    useCart();
  const serviceFee = items.length > 0 ? Math.round(subtotal * 0.08) : 0;
  const estimatedTotal = subtotal + serviceFee;

  return (
    <main className="min-h-screen bg-[#e7dfd2] text-[#11100d]">
      <header className="flex items-center justify-between border-b border-[#2d261f]/15 px-6 py-6 text-[9px] font-semibold uppercase tracking-[0.36em] sm:px-10 lg:px-16">
        <Link href="/">Noirtable</Link>
        <nav className="flex gap-7">
          <Link href="/menu">Menu</Link>
          <Link href="/staff">Staff</Link>
        </nav>
      </header>

      <section className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[42%_58%]">
        <div
          className="relative min-h-[420px] overflow-hidden border-b border-[#2d261f]/15 lg:min-h-full lg:border-b-0 lg:border-r"
          style={{ minHeight: 420, overflow: "hidden", position: "relative" }}
        >
          <img
            src="/images/hero/noirtable-reservation-still-life.jpg"
            alt="Noirtable table setting"
            width={1537}
            height={1023}
            fetchPriority="high"
            decoding="sync"
            className="object-cover object-center"
            style={{
              height: "100%",
              inset: 0,
              objectFit: "cover",
              objectPosition: "center",
              position: "absolute",
              width: "100%",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,16,13,0.08)_0%,rgba(17,16,13,0.45)_100%)]" />
          <div className="absolute bottom-8 left-6 right-6 text-[#f6efe4] sm:left-10 sm:right-10 lg:bottom-12 lg:left-16 lg:right-16">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em]">
              Your order
            </p>
            <h1 className="mt-5 max-w-md font-serif text-5xl leading-[0.92] sm:text-7xl">
              Held for the kitchen.
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-[#f6efe4]/82">
              Review the plates, then send the note through when you are ready.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
          <div>
            <div className="flex items-end justify-between gap-5 border-b border-[#2d261f]/15 pb-6">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/55">
                  Cart
                </p>
                <h2 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
                  Order list
                </h2>
              </div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#1f1a15]/55">
                {itemCount} items
              </p>
            </div>

            {items.length === 0 ? (
              <div className="py-14">
                <p className="font-serif text-4xl leading-none sm:text-5xl">
                  Nothing here yet.
                </p>
                <Link
                  href="/menu"
                  className="mt-8 inline-block border border-[#2d261f]/22 px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.3em]"
                >
                  Back to menu
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#2d261f]/12">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[76px_1fr] gap-4 py-5 sm:grid-cols-[92px_1fr_auto] sm:items-center"
                  >
                    <div
                      className="relative h-[92px] overflow-hidden border border-[#2d261f]/14 bg-[#d8cebf]"
                      style={{
                        height: 92,
                        overflow: "hidden",
                        position: "relative",
                        width: 92,
                      }}
                    >
                      <img
                        src={item.image ?? "/images/hero/template-dish.jpg"}
                        alt={item.name}
                        width={1200}
                        height={675}
                        loading="lazy"
                        decoding="async"
                        className="object-cover"
                        style={{
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          width: "100%",
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-serif text-3xl leading-none">
                        {item.name}
                      </p>
                      <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.26em] text-[#1f1a15]/54">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="h-9 w-9 border border-[#2d261f]/18 text-sm"
                          aria-label={`Remove one ${item.name}`}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => addItem(item)}
                          className="h-9 w-9 border border-[#2d261f]/18 text-sm"
                          aria-label={`Add one ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="col-span-2 text-right text-sm sm:col-span-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 border-t border-[#2d261f]/15 pt-7">
            <div className="grid gap-3 text-sm text-[#1f1a15]/66">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#1f1a15]/52">
                  Total
                </p>
                <p className="mt-2 font-serif text-5xl leading-none">
                  {formatPrice(estimatedTotal)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {items.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="border border-[#2d261f]/18 px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.28em]"
                  >
                    Clear order
                  </button>
                ) : null}
                <Link
                  href={items.length > 0 ? "/checkout" : "/menu"}
                  className="bg-[#c2a16e] px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.3em]"
                >
                  {items.length > 0 ? "Place order" : "Menu"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
