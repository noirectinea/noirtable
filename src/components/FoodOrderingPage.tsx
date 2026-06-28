"use client";

import Link from "next/link";
import Image from "next/image";
import type { FormEvent } from "react";
import { useState } from "react";
import { menuItems, type MenuItem } from "@/data/menu";
import { formatPrice, useCart } from "@/lib/cart";
import { NoirtableMark } from "@/components/NoirtableMark";

const previewItems = menuItems.slice(0, 4);
const previewImages = [
  "/images/menu-dishes-fast/dish-01-oyster-royale.jpg",
  "/images/menu-dishes-fast/dish-02-truffle-beef-tartare.jpg",
  "/images/menu-dishes-fast/dish-03-burrata-noir.jpg",
  "/images/menu-dishes-fast/dish-04-charred-octopus.jpg",
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
        <a href="#room">Room</a>
        <Link href="/menu">Menu</Link>
        <a href="#reserve">Reserve</a>
        <Link href="/case-study">Journal</Link>
        <a href="#room">About</a>
      </nav>

      <p className="absolute bottom-20 left-1/2 -translate-x-1/2 -rotate-90 whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.36em] text-[#1c1712]">
        Private room
      </p>
    </aside>
  );
}

function MenuCard({
  item,
  index,
  onAdd,
}: {
  item: MenuItem;
  index: number;
  onAdd: (item: MenuItem) => void;
}) {
  const tags = ["Fresh", "Chef pick", "", ""];
  const prepTimes = ["10 min", "12 min", "9 min", "12 min"];
  const image = item.image ?? previewImages[index];

  return (
    <article className="grid min-h-[320px] border border-[#2d261f]/18 bg-[#e7dfd2]">
      <div className="relative h-[132px] overflow-hidden border-b border-[#2d261f]/14">
        <Image
          src={image}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 42vw, 100vw"
          quality={68}
          className="object-cover"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      <div className="grid content-between px-4 py-4">
        <div>
          <div className="flex items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#1f1a15]/62">
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#1f1a15]/62">
            <span>{item.category}</span>
            {tags[index] ? (
              <span className="border border-[#2d261f]/22 px-2 py-1 text-[7px] text-[#1f1a15]/70">
                {tags[index]}
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 font-serif text-2xl leading-none text-[#11100d]">
            {item.name}
          </h3>
          <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#1f1a15]/62">
            {prepTimes[index]}
          </p>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <p className="text-sm text-[#11100d]">{formatPrice(item.price)}</p>
          <button
            type="button"
            onClick={() => onAdd(item)}
            className="border-b border-[#11100d] pb-1 text-[8px] font-semibold uppercase tracking-[0.28em] text-[#11100d]"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}

export function FoodOrderingPage() {
  const [reservationName, setReservationName] = useState("");
  const [reservationPhone, setReservationPhone] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [reservationParty, setReservationParty] = useState("2 guests");
  const [reservationStatus, setReservationStatus] = useState("");
  const [isReservationSubmitting, setIsReservationSubmitting] = useState(false);
  const { addItem, itemCount } = useCart();

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
    <main className="min-h-screen overflow-x-clip bg-[#e7dfd2] text-[#11100d]">
      <Sidebar />

      <div className="lg:pl-[104px]">
        <section className="relative min-h-screen border-b border-[#2d261f]/15">
          <Image
            src="/images/hero/noirtable-hero-wide.jpg"
            alt=""
            fill
            preload
            sizes="100vw"
            quality={76}
            className="object-cover object-center"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div className="absolute inset-0 z-10 bg-[#e7dfd2]/18" />
          <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(231,223,210,0.42)_0%,rgba(231,223,210,0.22)_42%,rgba(231,223,210,0.08)_100%)]" />
          <header className="absolute left-0 right-0 top-0 z-20 grid grid-cols-[1fr_auto_1fr] items-start px-5 py-7 lg:px-16">
            <div className="text-[9px] font-semibold uppercase tracking-[0.36em] lg:hidden">
              Noirtable
            </div>
            <Link href="/" className="col-start-2 text-center">
              <span className="block font-serif text-lg leading-none tracking-[0.18em]">
                Noirtable
              </span>
              <span className="mt-4 block text-[8px] font-semibold uppercase tracking-[0.32em] text-[#11100d]/55">
                Dining room
              </span>
            </Link>
            <a
              href="#reserve"
              className="col-start-3 justify-self-end border border-[#11100d]/45 px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.32em] transition hover:bg-[#11100d] hover:text-[#e7dfd2]"
            >
              Reserve
            </a>
          </header>

          <div className="grid min-h-screen lg:grid-cols-[42%_58%]">
            <div className="relative z-10 grid content-center px-6 pb-12 pt-36 lg:px-16">
              <h1 className="font-serif text-6xl leading-[0.95] tracking-[-0.01em] text-[#11100d] sm:text-7xl lg:text-[5.6rem]">
                Noirtable
              </h1>
              <p className="mt-9 text-[9px] font-semibold uppercase tracking-[0.42em]">
                Small room. Late kitchen. Tables by phone.
              </p>
              <p className="mt-8 max-w-[310px] text-sm leading-7 text-[#11100d]/72">
                A short list. Built around the market,
                <br />
                the room, and the hour.
              </p>
              <a
                href="/menu"
                className="mt-10 inline-flex w-fit bg-[#c2a16e] px-9 py-5 text-[9px] font-semibold uppercase tracking-[0.34em] text-[#11100d] transition hover:bg-[#b9935f]"
              >
                Choose a plate
              </a>
            </div>

            <div className="relative min-h-[360px] border-t border-[#2d261f]/15 lg:border-t-0">
              <div className="absolute bottom-16 right-6 w-[260px] border border-[#2d261f]/14 bg-[#e7dfd2]/72 px-6 py-5 text-[#11100d] lg:right-16">
                <div className="flex justify-between border-b border-[#2d261f]/16 pb-4 text-[8px] font-semibold uppercase tracking-[0.28em] text-[#11100d]/62">
                  <span>Tonight</span>
                  <span>Two late</span>
                </div>
                <p className="mt-5 text-sm leading-6 text-[#11100d]/68">
                  Six tables, a short pickup window, and a kitchen kept small
                  enough to stay precise.
                </p>
                <div className="mt-6 flex items-end justify-between border-t border-[#2d261f]/16 pt-4">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#11100d]/62">
                    Main room
                  </span>
                  <span className="font-serif text-4xl leading-none text-[#11100d]/75">
                    NT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="room"
          className="grid border-b border-[#2d261f]/15 lg:min-h-screen lg:grid-cols-[42%_58%]"
        >
          <div className="grid content-center border-b border-[#2d261f]/15 px-6 py-16 lg:border-b-0 lg:border-r lg:px-16">
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em]">
              The room
            </p>
            <h2 className="mt-12 max-w-sm font-serif text-5xl leading-[1.02] text-[#11100d]">
              Six tables,
              <br />
              dinner nightly.
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-7 text-[#11100d]/68">
              Opened in 2019. Seasonal plates, low light, and reservations
              confirmed quietly by phone.
            </p>
            <dl className="mt-14 grid gap-0 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#11100d]/72">
              {[
                ["Opened", "2019"],
                ["Dinner", "Nightly"],
                ["Room", "Six tables"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-[#2d261f]/16 py-4 last:border-b-0"
                >
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative min-h-[420px] overflow-hidden lg:min-h-screen">
            <Image
              src="/images/hero/noirtable-room.jpg"
              alt="Noirtable dining room"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              quality={76}
              className="object-cover object-center"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </section>

        <section className="grid border-b border-[#2d261f]/15 lg:min-h-screen lg:grid-rows-[1fr_1fr]">
          <div
            id="menu"
            className="grid px-6 py-10 lg:grid-cols-[24%_76%] lg:px-0 lg:py-0"
          >
            <div className="grid content-center pb-10 lg:border-r lg:border-[#2d261f]/15 lg:px-16 lg:py-10">
              <p className="text-[9px] font-semibold uppercase tracking-[0.36em]">
                The menu
              </p>
              <h2 className="mt-10 font-serif text-5xl leading-[1.02] text-[#11100d]">
                Six tables.
                <br />
                Late plates.
                <br />
                Quiet service.
              </h2>
              <span className="mt-10 h-px w-24 bg-[#2d261f]/22" />
              <Link
                href="/menu"
                className="mt-8 w-fit border-b border-[#11100d] pb-2 text-[9px] font-semibold uppercase tracking-[0.28em]"
              >
                View full menu
              </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-4 lg:gap-4 lg:p-10">
              {previewItems.map((item, index) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  index={index}
                  onAdd={addItem}
                />
              ))}
            </div>
          </div>

          <div
            id="reserve"
            className="grid border-t border-[#2d261f]/15 lg:grid-cols-[24%_36%_40%]"
          >
            <div className="px-6 py-14 lg:px-16 lg:py-10">
              <p className="text-[9px] font-semibold uppercase tracking-[0.36em]">
                Reservations
              </p>
              <h2 className="mt-10 font-serif text-4xl leading-[1.02] text-[#11100d] lg:text-5xl">
                A table request,
                <br />
                kept simple.
              </h2>
              <p className="mt-7 max-w-[270px] text-sm leading-7 text-[#11100d]/68">
                Send a name, a number, and the hour you have in mind. The room
                confirms every table by phone.
              </p>
            </div>

            <form
              onSubmit={submitReservation}
              className="grid content-center gap-3 border-y border-[#2d261f]/15 px-6 py-10 lg:border-x lg:border-y-0 lg:px-8"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={reservationName}
                  onChange={(event) => setReservationName(event.target.value)}
                  placeholder="Name"
                  className="h-14 border border-[#2d261f]/18 bg-transparent px-5 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#11100d] outline-none placeholder:text-[#11100d]/70 focus:border-[#11100d]/45"
                />
                <input
                  value={reservationPhone}
                  onChange={(event) => setReservationPhone(event.target.value)}
                  placeholder="Phone"
                  className="h-14 border border-[#2d261f]/18 bg-transparent px-5 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#11100d] outline-none placeholder:text-[#11100d]/70 focus:border-[#11100d]/45"
                />
                <input
                  value={reservationTime}
                  onChange={(event) => setReservationTime(event.target.value)}
                  placeholder="Preferred time"
                  className="h-14 border border-[#2d261f]/18 bg-transparent px-5 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#11100d] outline-none placeholder:text-[#11100d]/70 focus:border-[#11100d]/45"
                />
                <select
                  value={reservationParty}
                  onChange={(event) => setReservationParty(event.target.value)}
                  className="h-14 border border-[#2d261f]/18 bg-transparent px-5 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#11100d] outline-none focus:border-[#11100d]/45"
                >
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4 guests</option>
                  <option>6 guests</option>
                </select>
              </div>
              <button
                disabled={isReservationSubmitting}
                className="h-14 bg-[#c2a16e] text-[9px] font-semibold uppercase tracking-[0.34em] text-[#11100d] transition hover:bg-[#b9935f] disabled:opacity-60"
              >
                {isReservationSubmitting ? "Sending" : "Request a table"}
              </button>
              {reservationStatus ? (
                <p className="border border-[#2d261f]/18 px-5 py-4 text-xs leading-5 text-[#11100d]/68">
                  {reservationStatus}
                </p>
              ) : null}
            </form>

            <div className="relative min-h-[320px] overflow-hidden">
              <Image
                src="/images/hero/noirtable-reservation-still-life.jpg"
                alt="Noirtable table setting"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                quality={76}
                className="object-cover object-center"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-5 px-6 py-9 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#11100d] lg:px-16">
          <span>Noirtable</span>
          <nav className="flex flex-wrap gap-7">
            <Link href="/cart">{itemCount > 0 ? `Cart ${itemCount}` : "Cart"}</Link>
            <a href="#reserve">Reserve</a>
            <Link href="/staff">Staff desk</Link>
            <Link href="/case-study">Case study</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
