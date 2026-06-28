"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice, useCart } from "@/lib/cart";

export function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceFee = items.length > 0 ? Math.round(subtotal * 0.08) : 0;
  const total = subtotal + serviceFee;

  async function submitOrder() {
    if (items.length === 0) {
      setStatus("Add at least one dish before confirming.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName,
          phone,
          fulfillment: "Pickup",
          note: [pickupTime ? `Preferred pickup: ${pickupTime}` : "", note]
            .filter(Boolean)
            .join(" / "),
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const result = (await response.json()) as {
        orderId?: string;
        message?: string;
        total?: number;
      };

      if (!response.ok) {
        setStatus(result.message ?? "Order rejected.");
        return;
      }

      const successParams = new URLSearchParams({
        order: result.orderId ?? "NT",
        total: String(result.total ?? total),
        type: pickupTime ? `Pickup ${pickupTime}` : "Pickup",
      });

      clearCart();
      router.push(`/order/success?${successParams.toString()}`);
    } catch {
      setStatus("Order service unavailable.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#e7dfd2] text-[#11100d]">
      <header className="flex items-center justify-between border-b border-[#2d261f]/15 px-6 py-6 text-[9px] font-semibold uppercase tracking-[0.36em] sm:px-10 lg:px-16">
        <Link href="/">Noirtable</Link>
        <nav className="flex gap-7">
          <Link href="/cart">Cart</Link>
          <Link href="/staff">Staff</Link>
        </nav>
      </header>

      <section className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[42%_58%]">
        <div className="flex flex-col justify-center border-b border-[#2d261f]/15 px-6 py-14 sm:px-10 lg:border-b-0 lg:border-r lg:px-16">
          <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/55">
            Checkout
          </p>
          <h1 className="mt-8 max-w-md font-serif text-6xl leading-[0.92] sm:text-7xl">
            A final note, before the kitchen.
          </h1>
          <p className="mt-8 max-w-sm text-sm leading-7 text-[#1f1a15]/68">
            Enter your details. The room receives the order quietly.
          </p>
          <div className="mt-12 border-y border-[#2d261f]/15 py-5 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#1f1a15]/55">
            Pickup / Noirtable / Demo payment
          </div>
        </div>

        <div className="grid content-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr]">
            <div>
              <div className="grid gap-4">
                <input
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  placeholder="Name"
                  className="h-14 border border-[#2d261f]/18 bg-transparent px-5 text-[10px] font-semibold uppercase tracking-[0.28em] outline-none placeholder:text-[#11100d]/48 focus:border-[#11100d]/45"
                />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Phone"
                  className="h-14 border border-[#2d261f]/18 bg-transparent px-5 text-[10px] font-semibold uppercase tracking-[0.28em] outline-none placeholder:text-[#11100d]/48 focus:border-[#11100d]/45"
                />
                <input
                  value={pickupTime}
                  onChange={(event) => setPickupTime(event.target.value)}
                  placeholder="Preferred pickup time"
                  className="h-14 border border-[#2d261f]/18 bg-transparent px-5 text-[10px] font-semibold uppercase tracking-[0.28em] outline-none placeholder:text-[#11100d]/48 focus:border-[#11100d]/45"
                />
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Comment / note"
                  rows={5}
                  className="resize-none border border-[#2d261f]/18 bg-transparent px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.24em] outline-none placeholder:text-[#11100d]/48 focus:border-[#11100d]/45"
                />
              </div>

              <button
                type="button"
                onClick={submitOrder}
                disabled={isSubmitting}
                className="mt-5 h-14 w-full bg-[#c2a16e] text-[9px] font-semibold uppercase tracking-[0.34em] disabled:opacity-60"
              >
                {isSubmitting ? "Sending" : "Place order / pay"}
              </button>

              {status ? (
                <p className="mt-5 border border-[#2d261f]/18 px-5 py-4 text-sm leading-6 text-[#1f1a15]/68">
                  {status}
                </p>
              ) : null}
            </div>

            <aside className="border-y border-[#2d261f]/15 py-6">
              <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#1f1a15]/55">
                Order summary
              </p>
              <div className="mt-5 divide-y divide-[#2d261f]/12">
                {items.length === 0 ? (
                  <p className="py-5 text-sm text-[#1f1a15]/60">
                    Your cart is empty.
                  </p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between py-4">
                      <span className="pr-5 font-serif text-2xl leading-none">
                        {item.name}
                      </span>
                      <span className="text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6 grid gap-3 border-t border-[#2d261f]/15 pt-5 text-sm text-[#1f1a15]/66">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
              </div>
              <div className="mt-7 flex items-end justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#1f1a15]/52">
                  Total
                </span>
                <span className="font-serif text-5xl leading-none">
                  {formatPrice(total)}
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
