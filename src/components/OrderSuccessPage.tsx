"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/cart";

export function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") ?? "NT";
  const fulfillment = searchParams.get("type") ?? "Order";
  const total = Number(searchParams.get("total") ?? 0);

  return (
    <main className="min-h-screen bg-[#241b15] text-[#ede4d4]">
      <header className="mx-auto flex max-w-[1480px] items-center justify-between px-4 py-5 sm:px-8 sm:py-7">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.34em] text-white sm:text-sm sm:tracking-[0.44em]"
        >
          Noirtable
        </Link>
        <Link
          href="/admin/orders"
          className="text-[11px] uppercase tracking-[0.28em] text-[#b4a895] hover:text-white"
        >
          Staff desk
        </Link>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-[1480px] items-center gap-10 px-4 pb-20 pt-8 sm:px-8 lg:grid-cols-[0.72fr_1fr]">
        <div className="border-y border-[#6a4f39] bg-[#2b2119] px-5 py-8 sm:px-7 sm:py-10">
          <p className="text-[10px] uppercase tracking-[0.36em] text-[#c2ad83]">
            Order received
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.9] text-white sm:text-7xl">
            The kitchen has it.
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-[#cdbb9d]">
            We have your order. A member of the room will call if anything needs
            confirming before service.
          </p>

          <div className="mt-10 grid gap-5 border-t border-[#614b39] pt-6 text-sm text-[#d0c6b8]">
            <div className="flex items-center justify-between gap-6">
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#8f806b]">
                Order
              </span>
              <span className="font-serif text-3xl text-white">{orderId}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#8f806b]">
                Service
              </span>
              <span>{fulfillment}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#8f806b]">
                Total
              </span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/"
              className="border border-[#e4d3b3] px-5 py-4 text-[10px] uppercase tracking-[0.26em] text-white hover:bg-[#e4d3b3] hover:text-black"
            >
              Back to menu
            </Link>
            <Link
              href="/admin/orders"
              className="border border-[#3f3328] px-5 py-4 text-[10px] uppercase tracking-[0.26em] text-[#cdbb9d] hover:border-[#e4d3b3] hover:text-white"
            >
              View order
            </Link>
          </div>
        </div>

        <div className="hidden border-l border-[#6a4f39] pl-8 lg:block">
          <p className="max-w-xs font-serif text-4xl leading-tight text-[#d8c4a2]">
            Dinner is handled quietly, without making the guest watch the
            machinery.
          </p>
          <p className="mt-8 max-w-sm text-sm leading-7 text-[#9f8d76]">
            Your note is saved with the staff desk, where the room can accept
            it before service begins.
          </p>
        </div>
      </section>
    </main>
  );
}
