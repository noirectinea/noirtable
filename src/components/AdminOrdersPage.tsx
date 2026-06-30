"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import type { MenuCategory } from "@/data/menu";
import { formatPrice } from "@/lib/cart";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { StaffMenuItem } from "@/server/menu-admin";
import type { OrderStatus, StoredOrder } from "@/server/orders";
import type {
  ReservationStatus,
  StoredReservation,
} from "@/server/reservations";

const orderStatusLabels: Record<OrderStatus, string> = {
  new: "New",
  accepted: "Confirmed",
  preparing: "Preparing",
  completed: "Ready",
  canceled: "Canceled",
};

const reservationStatusLabels: Record<ReservationStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  declined: "Declined",
};

const orderFilters: Array<"all" | OrderStatus> = [
  "all",
  "new",
  "accepted",
  "preparing",
  "completed",
  "canceled",
];

const orderActions: Array<{ label: string; status: OrderStatus }> = [
  { label: "Confirm", status: "accepted" },
  { label: "Preparing", status: "preparing" },
  { label: "Ready", status: "completed" },
  { label: "Cancel", status: "canceled" },
];

const menuCategories: MenuCategory[] = [
  "Starters",
  "Signature",
  "Pasta",
  "Seafood",
  "Grill",
  "Desserts",
  "Drinks",
];

function formatServiceTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [reservations, setReservations] = useState<StoredReservation[]>([]);
  const [staffMenuItems, setStaffMenuItems] = useState<StaffMenuItem[]>([]);
  const [activeOrderFilter, setActiveOrderFilter] =
    useState<"all" | OrderStatus>("all");
  const [status, setStatus] = useState("Loading orders...");
  const [updatingId, setUpdatingId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [menuDraft, setMenuDraft] = useState({
    name: "",
    category: "Starters" as MenuCategory,
    price: "",
    prepTime: "15 min",
    badge: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    async function loadOrders(token: string) {
      try {
        const [ordersResponse, reservationsResponse, menuResponse] = await Promise.all([
          fetch("/api/orders", {
            cache: "no-store",
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/reservations", {
            cache: "no-store",
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/menu-items", {
            cache: "no-store",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (
          ordersResponse.status === 401 ||
          reservationsResponse.status === 401 ||
          menuResponse.status === 401
        ) {
          router.replace("/staff/login");
          return;
        }

        const ordersResult = (await ordersResponse.json()) as {
          orders?: StoredOrder[];
        };
        const reservationsResult = (await reservationsResponse.json()) as {
          reservations?: StoredReservation[];
        };
        const menuResult = (await menuResponse.json()) as {
          items?: StaffMenuItem[];
        };

        setOrders(ordersResult.orders ?? []);
        setReservations(reservationsResult.reservations ?? []);
        setStaffMenuItems(menuResult.items ?? []);
        setStatus("");
      } catch {
        setStatus("Could not load orders.");
      }
    }

    async function checkStaffSession() {
      const supabase = getSupabaseClient();

      if (!supabase) {
        setStatus("Staff login is not configured.");
        return;
      }

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        router.replace("/staff/login");
        return;
      }

      setAccessToken(token);
      await loadOrders(token);
    }

    checkStaffSession();
  }, [router]);

  async function signOut() {
    const supabase = getSupabaseClient();

    await supabase?.auth.signOut();
    router.replace("/staff/login");
  }

  async function updateOrder(id: string, nextStatus: OrderStatus) {
    setUpdatingId(id);

    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const result = (await response.json()) as {
        order?: StoredOrder;
        message?: string;
      };

      if (!response.ok || !result.order) {
        setStatus(result.message ?? "Could not update order.");
        return;
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.id === id ? result.order! : order)),
      );
      setStatus("");
    } catch {
      setStatus("Could not update order.");
    } finally {
      setUpdatingId("");
    }
  }

  async function updateReservation(
    id: string,
    nextStatus: ReservationStatus,
  ) {
    setUpdatingId(id);

    try {
      const response = await fetch("/api/reservations", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const result = (await response.json()) as {
        reservation?: StoredReservation;
        message?: string;
      };

      if (!response.ok || !result.reservation) {
        setStatus(result.message ?? "Could not update reservation.");
        return;
      }

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === id ? result.reservation! : reservation,
        ),
      );
      setStatus("");
    } catch {
      setStatus("Could not update reservation.");
    } finally {
      setUpdatingId("");
    }
  }

  async function createMenuItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUpdatingId("menu-new");

    try {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...menuDraft,
          price: Number(menuDraft.price),
        }),
      });
      const result = (await response.json()) as {
        item?: StaffMenuItem;
        message?: string;
      };

      if (!response.ok || !result.item) {
        setStatus(result.message ?? "Could not add dish.");
        return;
      }

      setStaffMenuItems((currentItems) => [...currentItems, result.item!]);
      setMenuDraft({
        name: "",
        category: "Starters",
        price: "",
        prepTime: "15 min",
        badge: "",
        description: "",
        image: "",
      });
      setStatus("Dish added to the menu.");
    } catch {
      setStatus("Could not add dish.");
    } finally {
      setUpdatingId("");
    }
  }

  async function updateMenuItem(
    id: number,
    patch: Partial<StaffMenuItem>,
  ) {
    setUpdatingId(`menu-${id}`);

    try {
      const response = await fetch("/api/menu-items", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...patch,
        }),
      });
      const result = (await response.json()) as {
        item?: StaffMenuItem;
        message?: string;
      };

      if (!response.ok || !result.item) {
        setStatus(result.message ?? "Could not update dish.");
        return;
      }

      setStaffMenuItems((currentItems) =>
        currentItems.map((item) => (item.id === id ? result.item! : item)),
      );
      setStatus("");
    } catch {
      setStatus("Could not update dish.");
    } finally {
      setUpdatingId("");
    }
  }

  const visibleOrders =
    activeOrderFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeOrderFilter);
  const revenue = orders
    .filter((order) => order.status !== "canceled")
    .reduce((sum, order) => sum + order.total, 0);
  const activeReservations = reservations.filter(
    (reservation) => reservation.status !== "declined",
  );

  return (
    <main className="min-h-screen bg-[#e7dfd2] text-[#11100d]">
      <header className="flex items-center justify-between border-b border-[#2d261f]/15 px-6 py-6 text-[9px] font-semibold uppercase tracking-[0.36em] sm:px-10 lg:px-16">
        <Link href="/">Noirtable</Link>
        <nav className="flex gap-7">
          <Link href="/menu">Menu</Link>
          <Link href="/case-study">Journal</Link>
          <button type="button" onClick={signOut}>
            Logout
          </button>
        </nav>
      </header>

      <section className="grid border-b border-[#2d261f]/15 lg:min-h-[68vh] lg:grid-cols-[38%_62%]">
        <div className="flex flex-col justify-center border-b border-[#2d261f]/15 px-6 py-14 sm:px-10 lg:border-b-0 lg:border-r lg:px-16">
          <p className="text-[9px] font-semibold uppercase tracking-[0.38em] text-[#1f1a15]/55">
            Staff desk
          </p>
          <h1 className="mt-8 max-w-md font-serif text-6xl leading-[0.92] sm:text-8xl">
            Tonight&apos;s room, kept in order.
          </h1>
          <p className="mt-8 max-w-sm text-sm leading-7 text-[#1f1a15]/68">
            Orders and table requests for the evening team.
          </p>
        </div>

        <div className="grid content-center gap-4 px-6 py-10 sm:px-10 lg:px-16">
          <div className="grid border border-[#2d261f]/15 text-center sm:grid-cols-4">
            {[
              ["Orders", orders.length],
              ["Revenue", formatPrice(revenue)],
              ["Reservations", activeReservations.length],
              [
                "Open",
                orders.filter((order) =>
                  ["new", "accepted", "preparing"].includes(order.status),
                ).length,
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-b border-[#2d261f]/15 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <p className="font-serif text-4xl leading-none">{value}</p>
                <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#1f1a15]/52">
                  {label}
                </p>
              </div>
            ))}
          </div>
          {status ? (
            <p className="border border-[#2d261f]/15 px-5 py-4 text-sm text-[#1f1a15]/68">
              {status}
            </p>
          ) : null}
        </div>
      </section>

      <section className="border-b border-[#2d261f]/15 px-6 py-10 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/55">
              Orders
            </p>
            <h2 className="mt-3 font-serif text-5xl leading-none">Order queue</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {orderFilters.map((filter) => {
              const label =
                filter === "all" ? "All" : orderStatusLabels[filter];
              const count =
                filter === "all"
                  ? orders.length
                  : orders.filter((order) => order.status === filter).length;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveOrderFilter(filter)}
                  className={`shrink-0 border px-4 py-3 text-[8px] font-semibold uppercase tracking-[0.24em] ${
                    activeOrderFilter === filter
                      ? "border-[#11100d] bg-[#11100d] text-[#e7dfd2]"
                      : "border-[#2d261f]/18 text-[#1f1a15]/58"
                  }`}
                >
                  {label} {count}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {visibleOrders.length === 0 ? (
            <p className="border border-[#2d261f]/15 p-5 text-sm text-[#1f1a15]/64">
              No orders in this stage right now.
            </p>
          ) : null}

          {visibleOrders.map((order) => (
            <article
              key={order.id}
              className="grid gap-6 border border-[#2d261f]/15 p-5 lg:grid-cols-[220px_1fr_190px]"
            >
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#1f1a15]/52">
                  {order.id}
                </p>
                <p className="mt-4 font-serif text-3xl leading-none">
                  {order.guestName}
                </p>
                <p className="mt-3 text-sm text-[#1f1a15]/62">{order.phone}</p>
                <p className="mt-2 text-sm text-[#1f1a15]/62">
                  {formatServiceTime(order.createdAt)}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="border border-[#2d261f]/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#1f1a15]/62">
                    {order.fulfillment}
                  </span>
                  <span className="border border-[#2d261f]/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#1f1a15]/62">
                    {orderStatusLabels[order.status]}
                  </span>
                </div>

                <div className="mt-5 grid gap-2">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.id}`}
                      className="flex justify-between border-b border-[#2d261f]/10 py-2 text-sm"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{formatPrice(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>

                {order.address ? (
                  <p className="mt-4 text-sm text-[#1f1a15]/62">{order.address}</p>
                ) : null}
                {order.note ? (
                  <p className="mt-2 text-sm text-[#1f1a15]/62">{order.note}</p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2">
                  {orderActions.map((action) => (
                    <button
                      key={action.status}
                      type="button"
                      onClick={() => updateOrder(order.id, action.status)}
                      disabled={updatingId === order.id}
                      className={`border px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.22em] disabled:opacity-50 ${
                        order.status === action.status
                          ? "border-[#11100d] bg-[#11100d] text-[#e7dfd2]"
                          : "border-[#2d261f]/18 text-[#1f1a15]/62"
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid content-between">
                <p className="font-serif text-5xl leading-none">
                  {formatPrice(order.total)}
                </p>
                <div className="mt-5 grid gap-2 text-sm text-[#1f1a15]/62">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service</span>
                    <span>{formatPrice(order.serviceFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid border-b border-[#2d261f]/15 lg:grid-cols-2">
        <div className="border-b border-[#2d261f]/15 px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-16">
          <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/55">
            Reservations
          </p>
          <h2 className="mt-3 font-serif text-5xl leading-none">
            Table requests
          </h2>
          <div className="mt-8 grid gap-4">
            {activeReservations.length === 0 ? (
              <p className="border border-[#2d261f]/15 p-5 text-sm text-[#1f1a15]/64">
                No table requests yet.
              </p>
            ) : null}
            {activeReservations.slice(0, 6).map((reservation) => (
              <article key={reservation.id} className="border border-[#2d261f]/15 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#1f1a15]/52">
                      {reservation.id}
                    </p>
                    <p className="mt-3 font-serif text-3xl leading-none">
                      {reservation.guestName}
                    </p>
                    <p className="mt-2 text-sm text-[#1f1a15]/62">
                      {reservation.phone}
                    </p>
                  </div>
                  <span className="border border-[#2d261f]/15 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#1f1a15]/58">
                    {reservationStatusLabels[reservation.status]}
                  </span>
                </div>
                <div className="mt-5 flex justify-between border-t border-[#2d261f]/10 pt-4 text-sm text-[#1f1a15]/62">
                  <span>{reservation.partySize}</span>
                  <span>{reservation.preferredTime}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(["confirmed", "declined"] as ReservationStatus[]).map(
                    (nextStatus) => (
                      <button
                        key={nextStatus}
                        type="button"
                        onClick={() =>
                          updateReservation(reservation.id, nextStatus)
                        }
                        disabled={updatingId === reservation.id}
                        className={`border px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.22em] disabled:opacity-50 ${
                          reservation.status === nextStatus
                            ? "border-[#11100d] bg-[#11100d] text-[#e7dfd2]"
                            : "border-[#2d261f]/18 text-[#1f1a15]/62"
                        }`}
                      >
                        {reservationStatusLabels[nextStatus]}
                      </button>
                    ),
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="px-6 py-10 sm:px-10 lg:px-16">
          <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#1f1a15]/55">
            Menu
          </p>
          <h2 className="mt-3 font-serif text-5xl leading-none">
            Tonight&apos;s list
          </h2>

          <form
            onSubmit={createMenuItem}
            className="mt-8 grid gap-3 border-y border-[#2d261f]/15 py-5"
          >
            <input
              value={menuDraft.name}
              onChange={(event) =>
                setMenuDraft((draft) => ({
                  ...draft,
                  name: event.target.value,
                }))
              }
              className="h-11 border border-[#2d261f]/15 bg-transparent px-4 text-sm outline-none placeholder:text-[#1f1a15]/38"
              placeholder="Dish name"
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={menuDraft.category}
                onChange={(event) =>
                  setMenuDraft((draft) => ({
                    ...draft,
                    category: event.target.value as MenuCategory,
                  }))
                }
                className="h-11 border border-[#2d261f]/15 bg-transparent px-4 text-[9px] font-semibold uppercase tracking-[0.24em] outline-none"
              >
                {menuCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                value={menuDraft.price}
                onChange={(event) =>
                  setMenuDraft((draft) => ({
                    ...draft,
                    price: event.target.value,
                  }))
                }
                className="h-11 border border-[#2d261f]/15 bg-transparent px-4 text-sm outline-none placeholder:text-[#1f1a15]/38"
                min="1"
                placeholder="Price"
                required
                type="number"
              />
              <input
                value={menuDraft.prepTime}
                onChange={(event) =>
                  setMenuDraft((draft) => ({
                    ...draft,
                    prepTime: event.target.value,
                  }))
                }
                className="h-11 border border-[#2d261f]/15 bg-transparent px-4 text-sm outline-none placeholder:text-[#1f1a15]/38"
                placeholder="15 min"
              />
              <input
                value={menuDraft.badge}
                onChange={(event) =>
                  setMenuDraft((draft) => ({
                    ...draft,
                    badge: event.target.value,
                  }))
                }
                className="h-11 border border-[#2d261f]/15 bg-transparent px-4 text-sm outline-none placeholder:text-[#1f1a15]/38"
                placeholder="Badge"
              />
            </div>
            <textarea
              value={menuDraft.description}
              onChange={(event) =>
                setMenuDraft((draft) => ({
                  ...draft,
                  description: event.target.value,
                }))
              }
              className="min-h-20 resize-none border border-[#2d261f]/15 bg-transparent px-4 py-3 text-sm leading-6 outline-none placeholder:text-[#1f1a15]/38"
              placeholder="Short kitchen note"
            />
            <input
              value={menuDraft.image}
              onChange={(event) =>
                setMenuDraft((draft) => ({
                  ...draft,
                  image: event.target.value,
                }))
              }
              className="h-11 border border-[#2d261f]/15 bg-transparent px-4 text-sm outline-none placeholder:text-[#1f1a15]/38"
              placeholder="/images/generated-dishes-fast/pasta.jpg"
            />
            <button
              type="submit"
              disabled={updatingId === "menu-new"}
              className="h-11 border border-[#11100d] text-[8px] font-semibold uppercase tracking-[0.28em] text-[#11100d] transition-colors duration-300 hover:bg-[#d7c09a] disabled:opacity-50"
            >
              Add dish
            </button>
          </form>

          <div className="mt-6 divide-y divide-[#2d261f]/12 border-y border-[#2d261f]/15">
            {staffMenuItems.map((item) => (
              <div key={item.id} className="grid gap-4 py-4 xl:grid-cols-[1fr_220px]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-serif text-2xl leading-none">
                      {item.name}
                    </p>
                    <span
                      className={`border px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.22em] ${
                        item.active
                          ? "border-[#2d261f]/16 text-[#1f1a15]/50"
                          : "border-[#2d261f]/28 text-[#1f1a15]/35"
                      }`}
                    >
                      {item.active ? "On menu" : "Hidden"}
                    </span>
                  </div>
                  <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.24em] text-[#1f1a15]/50">
                    {item.category} / {item.prepTime}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-4 xl:grid-cols-1">
                  <input
                    defaultValue={item.price}
                    onBlur={(event) => {
                      const nextPrice = Number(event.currentTarget.value);
                      if (Number.isFinite(nextPrice) && nextPrice !== item.price) {
                        updateMenuItem(item.id, { price: nextPrice });
                      }
                    }}
                    className="h-9 border border-[#2d261f]/15 bg-transparent px-3 text-xs outline-none"
                    min="1"
                    type="number"
                    aria-label={`${item.name} price`}
                  />
                  <input
                    defaultValue={item.prepTime}
                    onBlur={(event) => {
                      if (event.currentTarget.value !== item.prepTime) {
                        updateMenuItem(item.id, {
                          prepTime: event.currentTarget.value,
                        });
                      }
                    }}
                    className="h-9 border border-[#2d261f]/15 bg-transparent px-3 text-xs outline-none"
                    placeholder="Prep"
                    aria-label={`${item.name} prep time`}
                  />
                  <input
                    defaultValue={item.badge ?? ""}
                    onBlur={(event) => {
                      if (event.currentTarget.value !== (item.badge ?? "")) {
                        updateMenuItem(item.id, {
                          badge: event.currentTarget.value,
                        });
                      }
                    }}
                    className="h-9 border border-[#2d261f]/15 bg-transparent px-3 text-xs outline-none"
                    placeholder="Badge"
                    aria-label={`${item.name} badge`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateMenuItem(item.id, { active: !item.active })
                    }
                    disabled={updatingId === `menu-${item.id}`}
                    className="h-9 border border-[#2d261f]/18 px-3 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#1f1a15]/62 transition-colors duration-300 hover:bg-[#d7c09a] disabled:opacity-50"
                  >
                    {item.active ? "Hide" : "Restore"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-5 px-6 py-8 text-[9px] font-semibold uppercase tracking-[0.32em] sm:px-10 lg:px-16">
        <span>Noirtable</span>
        <nav className="flex flex-wrap gap-7">
          <Link href="/cart">Cart</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/case-study">Journal</Link>
        </nav>
      </footer>
    </main>
  );
}
