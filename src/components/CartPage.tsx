"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice, useCart } from "@/lib/cart";

export function CartPage() {
  const { items, itemCount, subtotal, addItem, removeItem, clearCart } =
    useCart();
  const [cartHeroSrc, setCartHeroSrc] = useState("/images/hero/cart-lounge.webp");
  const serviceFee = items.length > 0 ? Math.round(subtotal * 0.08) : 0;
  const estimatedTotal = subtotal + serviceFee;

  return (
    <main className="min-h-screen bg-[#241b15] text-[#ede4d4]">
      <header className="mx-auto flex max-w-[1480px] items-center justify-between px-4 py-5 sm:px-8 sm:py-7">
        <Link href="/" className="text-xs uppercase tracking-[0.28em] text-white sm:text-sm sm:tracking-[0.44em]">
          Noirtable
        </Link>
        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.28em] text-[#b4a895] hover:text-white"
        >
          Menu
        </Link>
      </header>

      <section className="mx-auto grid max-w-[1480px] gap-6 px-4 pb-20 pt-2 sm:gap-8 sm:px-8 sm:pt-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-black sm:min-h-[620px]">
          <Image
            src={cartHeroSrc}
            alt="Warm restaurant lounge"
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-[58%_50%] opacity-82"
            onError={() => setCartHeroSrc("/images/hero/lounge.png")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/18 to-black/5" />
          <div className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
            <p className="text-[10px] uppercase tracking-[0.36em] text-[#c2ad83]">
              Your order
            </p>
            <h1 className="mt-4 max-w-xs font-serif text-4xl leading-[0.9] text-white sm:max-w-none sm:text-7xl">
              Held for the kitchen.
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#c8b295]">
              Review the plates, then send the note through when you are ready.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between border-y border-[#614b39] bg-[#2b2119] px-4 py-6 sm:px-6 sm:py-8">
          {items.length === 0 ? (
            <div>
              <p className="font-serif text-3xl uppercase tracking-[0.04em] text-white sm:text-5xl">
                Nothing here yet.
              </p>
              <Link
                href="/#menu"
                className="mt-8 inline-block border border-[#6f604c] px-5 py-4 text-[10px] uppercase tracking-[0.24em] text-white hover:border-white sm:text-[11px] sm:tracking-[0.28em]"
              >
                Back to menu
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div
                  key={item.id}
                    className="grid grid-cols-[68px_1fr] gap-4 border-b border-[#614b39] pb-5 sm:grid-cols-[88px_1fr_auto] sm:items-center"
                >
                  <div className="relative h-[88px] min-h-[88px] overflow-hidden bg-black sm:h-28">
                    <Image
                      src={item.image ?? "/images/dishes/tasting-menu.jpg"}
                      alt={item.name}
                      fill
                      sizes="88px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-menu text-[1.6rem] leading-none text-white sm:text-3xl">
                      {item.name}
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#8f806b]">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="h-9 w-9 border border-[#3a2f25] text-white hover:border-white"
                        aria-label={`Remove one ${item.name}`}
                      >
                        -
                      </button>
                      <button
                        onClick={() => addItem(item)}
                        className="h-9 w-9 border border-[#3a2f25] text-white hover:border-white"
                        aria-label={`Add one ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="col-span-2 text-right text-sm text-[#c2ad83] sm:col-span-1">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 border-t border-[#614b39] pt-6">
            <div className="space-y-3 text-sm text-[#b4a895]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8f806b]">
                  Items {itemCount}
                </p>
                <p className="mt-2 font-serif text-3xl text-white sm:text-5xl">
                  {formatPrice(estimatedTotal)}
                </p>
              </div>
              <Link
                href={items.length > 0 ? "/checkout" : "/#menu"}
                className="border border-[#e4d3b3] px-5 py-4 text-[10px] uppercase tracking-[0.24em] text-white hover:bg-[#e4d3b3] hover:text-black sm:px-6 sm:text-[11px] sm:tracking-[0.28em]"
              >
                {items.length > 0 ? "Place order" : "Menu"}
              </Link>
            </div>
            {items.length > 0 ? (
              <button
                onClick={clearCart}
                className="mt-5 text-[10px] uppercase tracking-[0.24em] text-[#8f806b] hover:text-white"
              >
                Clear order
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
