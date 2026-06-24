"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice, useCart } from "@/lib/cart";

type Fulfillment = "Delivery" | "Pickup";

export function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("Delivery");
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceFee = items.length > 0 ? Math.round(subtotal * 0.08) : 0;
  const deliveryFee = items.length > 0 && fulfillment === "Delivery" ? 6 : 0;
  const total = subtotal + serviceFee + deliveryFee;

  async function submitOrder() {
    if (items.length === 0) {
      setStatus("Your cart is empty.");
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
          address,
          fulfillment,
          note,
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
        type: fulfillment,
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
    <main className="min-h-screen bg-[#241b15] text-[#ede4d4]">
      <header className="mx-auto flex max-w-[1480px] items-center justify-between px-4 py-5 sm:px-8 sm:py-7">
        <Link href="/" className="text-xs uppercase tracking-[0.28em] text-white sm:text-sm sm:tracking-[0.44em]">
          Noirtable
        </Link>
        <Link
          href="/cart"
          className="text-[11px] uppercase tracking-[0.28em] text-[#b4a895] hover:text-white"
        >
          Cart
        </Link>
      </header>

      <section className="mx-auto grid max-w-[1480px] gap-6 px-4 pb-20 pt-2 sm:gap-8 sm:px-8 sm:pt-8 lg:grid-cols-[1fr_0.72fr]">
        <div className="border-y border-[#614b39] bg-[#2b2119] px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-[10px] uppercase tracking-[0.36em] text-[#c2ad83]">
            Guest details
          </p>
          <h1 className="mt-5 font-serif text-4xl uppercase leading-[0.9] tracking-[0.04em] text-white sm:text-7xl">
            Confirm the order.
          </h1>

          <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2">
            {(["Delivery", "Pickup"] as Fulfillment[]).map((option) => (
              <button
                key={option}
                onClick={() => setFulfillment(option)}
                className={`border px-5 py-4 text-[10px] uppercase tracking-[0.24em] sm:text-[11px] sm:tracking-[0.28em] ${
                  fulfillment === option
                    ? "border-[#e4d3b3] bg-[#e4d3b3] text-black"
                    : "border-[#30261d] text-white hover:border-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-4">
            <input
              value={guestName}
              onChange={(event) => setGuestName(event.target.value)}
              placeholder="Name"
              className="border border-[#30261d] bg-transparent px-5 py-4 text-sm text-white outline-none placeholder:text-[#716552] focus:border-[#8f806b]"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone"
              className="border border-[#30261d] bg-transparent px-5 py-4 text-sm text-white outline-none placeholder:text-[#716552] focus:border-[#8f806b]"
            />
            {fulfillment === "Delivery" ? (
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Address"
                className="border border-[#30261d] bg-transparent px-5 py-4 text-sm text-white outline-none placeholder:text-[#716552] focus:border-[#8f806b]"
              />
            ) : null}
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Note"
              rows={4}
              className="resize-none border border-[#30261d] bg-transparent px-5 py-4 text-sm text-white outline-none placeholder:text-[#716552] focus:border-[#8f806b]"
            />
          </div>

          <button
            onClick={submitOrder}
            disabled={isSubmitting}
            className="mt-6 w-full border border-[#e4d3b3] bg-[#e4d3b3] px-6 py-5 text-[10px] uppercase tracking-[0.24em] text-black hover:bg-white disabled:opacity-60 sm:text-[11px] sm:tracking-[0.28em]"
          >
            {isSubmitting ? "Sending" : "Place order"}
          </button>

          {status ? (
            <div className="mt-5 border border-[#30261d] px-5 py-4 text-sm text-[#c2ad83]">
              <p>{status}</p>
              <Link
                href="/admin/orders"
                className="mt-3 inline-block text-[10px] uppercase tracking-[0.24em] text-white hover:text-[#e4d3b3]"
              >
                Staff desk
              </Link>
            </div>
          ) : null}
        </div>

        <aside className="order-first border-y border-[#614b39] bg-[#2b2119] py-6 lg:sticky lg:top-6 lg:order-none lg:self-start">
          <div className="px-5 sm:px-7">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#c2ad83]">
              Order total
            </p>
            <div className="mt-5 flex items-end justify-between gap-5 border-b border-[#614b39] pb-6">
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#8f806b]">
                Total
              </span>
              <span className="font-serif text-4xl leading-none text-white sm:text-6xl">
                {formatPrice(total)}
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm text-[#d0c6b8]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>{fulfillment}</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
            </div>

            <div className="mt-7 border border-[#30261d] px-4 py-4 text-xs leading-5 text-[#9f8d76]">
              After confirmation, the order is held for the kitchen and copied
              to the staff desk.
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
