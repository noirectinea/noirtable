"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/cart";

export function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") ?? "NT";
  const fulfillment = searchParams.get("type") ?? "Pickup";
  const total = Number(searchParams.get("total") ?? 0);

  return (
    <main className="min-h-screen bg-[#e7dfd2] text-[#11100d]">
      <header className="flex items-center justify-between border-b border-[#2d261f]/15 px-6 py-6 text-[9px] font-semibold uppercase tracking-[0.36em] sm:px-10 lg:px-16">
        <Link href="/">Noirtable</Link>
        <Link href="/staff">Staff desk</Link>
      </header>

      <section className="grid min-h-[calc(100vh-73px)] place-items-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[980px] border-y border-[#2d261f]/15 py-12">
          <p className="text-center text-[9px] font-semibold uppercase tracking-[0.42em] text-[#1f1a15]/55">
            Order received
          </p>
          <h1 className="mx-auto mt-7 max-w-2xl text-center font-serif text-6xl leading-[0.92] sm:text-8xl">
            The kitchen has it.
          </h1>
          <p className="mx-auto mt-7 max-w-sm text-center text-sm leading-7 text-[#1f1a15]/68">
            The room will call if anything needs confirming.
          </p>

          <div className="mx-auto mt-12 grid max-w-2xl divide-y divide-[#2d261f]/12 border-y border-[#2d261f]/15">
            <div className="flex items-center justify-between py-5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#1f1a15]/52">
                Order
              </span>
              <span className="font-serif text-3xl">{orderId}</span>
            </div>
            <div className="flex items-center justify-between py-5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#1f1a15]/52">
                Pickup note
              </span>
              <span className="text-sm text-[#1f1a15]/70">{fulfillment}</span>
            </div>
            <div className="flex items-center justify-between py-5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#1f1a15]/52">
                Total
              </span>
              <span className="font-serif text-4xl">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/menu"
              className="bg-[#c2a16e] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.32em]"
            >
              Back to menu
            </Link>
            <Link
              href="/staff"
              className="border border-[#2d261f]/18 px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.32em]"
            >
              View order
            </Link>
            <Link
              href="/cart"
              className="border border-[#2d261f]/18 px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.32em]"
            >
              Cart
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
