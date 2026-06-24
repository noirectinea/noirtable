"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/cart";
import type { OrderStatus, StoredOrder } from "@/server/orders";
import type {
  ReservationStatus,
  StoredReservation,
} from "@/server/reservations";

const orderStatusLabels: Record<OrderStatus, string> = {
  new: "New",
  accepted: "Accepted",
  preparing: "Preparing",
  completed: "Completed",
};

const reservationStatusLabels: Record<ReservationStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  declined: "Declined",
};

const orderFlow: OrderStatus[] = ["new", "accepted", "preparing", "completed"];
const orderFilters: Array<"all" | OrderStatus> = [
  "all",
  "new",
  "accepted",
  "preparing",
  "completed",
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
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [reservations, setReservations] = useState<StoredReservation[]>([]);
  const [activeOrderFilter, setActiveOrderFilter] =
    useState<"all" | OrderStatus>("all");
  const [status, setStatus] = useState("Loading orders...");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const [ordersResponse, reservationsResponse] = await Promise.all([
          fetch("/api/orders", { cache: "no-store" }),
          fetch("/api/reservations", { cache: "no-store" }),
        ]);
        const ordersResult = (await ordersResponse.json()) as {
          orders?: StoredOrder[];
        };
        const reservationsResult = (await reservationsResponse.json()) as {
          reservations?: StoredReservation[];
        };

        setOrders(ordersResult.orders ?? []);
        setReservations(reservationsResult.reservations ?? []);
        setStatus("");
      } catch {
        setStatus("Could not load staff desk.");
      }
    }

    loadOrders();
  }, []);

  async function updateOrder(id: string, nextStatus: OrderStatus) {
    setUpdatingId(id);

    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
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

  const newOrders = orders.filter((order) => order.status === "new").length;
  const acceptedOrders = orders.filter(
    (order) => order.status === "accepted",
  ).length;
  const preparingOrders = orders.filter(
    (order) => order.status === "preparing",
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  ).length;
  const visibleOrders =
    activeOrderFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeOrderFilter);

  return (
    <main className="min-h-screen bg-[#241b15] px-4 py-6 text-[#eee8dc] sm:px-8 sm:py-8">
      <header className="mx-auto flex max-w-[1500px] items-center justify-between border-b border-[#4a382b] pb-5">
        <Link href="/" className="text-xs font-semibold uppercase tracking-[0.34em] sm:text-sm sm:tracking-[0.44em]">
          Noirtable
        </Link>
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8f8374]">
          Staff desk
        </p>
      </header>

      <section className="mx-auto max-w-[1500px] py-10">
        <div className="grid gap-6 lg:grid-cols-[0.55fr_1.45fr] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[#a79b88]">
              Back of house
            </p>
            <h1 className="mt-4 font-serif text-6xl leading-none text-white sm:text-9xl">
              Service
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#a79b88]">
              Orders and table requests for the evening room.
            </p>
          </div>
          <div className="grid grid-cols-2 border border-[#4a382b] text-center lg:grid-cols-4">
            <div className="border-b border-r border-[#4a382b] p-4 sm:p-5 lg:border-b-0">
              <p className="font-serif text-4xl text-white sm:text-5xl">{orders.length}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#8f8374]">
                Orders
              </p>
            </div>
            <div className="border-b border-[#4a382b] p-4 sm:p-5 lg:border-b-0 lg:border-r">
              <p className="font-serif text-4xl text-white sm:text-5xl">
                {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#8f8374]">
                Revenue
              </p>
            </div>
            <div className="border-r border-[#4a382b] p-4 sm:p-5">
              <p className="font-serif text-4xl text-white sm:text-5xl">{newOrders}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#8f8374]">
                New
              </p>
            </div>
            <div className="p-4 sm:p-5">
              <p className="font-serif text-4xl text-white sm:text-5xl">{reservations.length}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#8f8374]">
                Requests
              </p>
            </div>
          </div>
        </div>

        {status ? (
          <p className="mt-10 border border-[#241d17] p-5 text-sm text-[#a79b88]">
            {status}
          </p>
        ) : null}

        <div className="mt-10 grid gap-4">
          {reservations.length > 0 ? (
            <section className="mb-6 grid gap-4 border-y border-[#4a382b] py-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#8f8374]">
                Table requests
              </p>
              <div className="grid gap-3 lg:grid-cols-3">
                {reservations.slice(0, 6).map((reservation) => (
                  <article
                    key={reservation.id}
                    className="border border-[#4a382b] bg-[#2b2119] p-4"
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#8f8374]">
                      {reservation.id}
                    </p>
                    <p className="mt-3 font-serif text-3xl text-white">
                      {reservation.guestName}
                    </p>
                    <p className="mt-2 text-sm text-[#a79b88]">
                      {reservation.phone}
                    </p>
                    <p className="mt-3 inline-block border border-[#3a3027] px-3 py-2 text-[9px] uppercase tracking-[0.22em] text-[#d9ccb7]">
                      {reservationStatusLabels[reservation.status]}
                    </p>
                    <div className="mt-4 flex justify-between border-t border-[#241d17] pt-3 text-xs text-[#d9ccb7]">
                      <span>{reservation.partySize}</span>
                      <span>{reservation.preferredTime}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(["confirmed", "declined"] as ReservationStatus[]).map(
                        (nextStatus) => (
                          <button
                            key={nextStatus}
                            onClick={() =>
                              updateReservation(reservation.id, nextStatus)
                            }
                            disabled={updatingId === reservation.id}
                            className={`border px-3 py-2 text-[9px] uppercase tracking-[0.2em] transition disabled:opacity-50 ${
                              reservation.status === nextStatus
                                ? "border-[#d9ccb7] bg-[#d9ccb7] text-black"
                                : "border-[#3a3027] text-[#a79b88] hover:border-white hover:text-white"
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
            </section>
          ) : null}

          <div className="flex gap-2 overflow-x-auto border-y border-[#4a382b] py-4">
            {orderFilters.map((filter) => {
              const label =
                filter === "all" ? "All orders" : orderStatusLabels[filter];
              const count =
                filter === "all"
                  ? orders.length
                  : orders.filter((order) => order.status === filter).length;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveOrderFilter(filter)}
                  className={`shrink-0 border px-4 py-3 text-[9px] uppercase tracking-[0.22em] transition ${
                    activeOrderFilter === filter
                      ? "border-[#d9ccb7] bg-[#d9ccb7] text-black"
                      : "border-[#3a3027] text-[#a79b88] hover:border-white hover:text-white"
                  }`}
                >
                  {label} · {count}
                </button>
              );
            })}
          </div>

          {orders.length === 0 && !status ? (
            <p className="border border-[#241d17] p-5 text-sm text-[#a79b88]">
              No orders yet. Place a test order or reservation to see it here.
            </p>
          ) : null}

          {orders.length > 0 && visibleOrders.length === 0 ? (
            <p className="border border-[#4a382b] bg-[#2b2119] p-5 text-sm text-[#a79b88]">
              No orders in this stage right now.
            </p>
          ) : null}

          {visibleOrders.map((order) => (
            <article
              key={order.id}
              className="grid gap-6 border border-[#4a382b] bg-[#2b2119] p-4 sm:p-5 lg:grid-cols-[220px_1fr_180px]"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8f8374]">
                  {order.id}
                </p>
                <p className="mt-4 font-serif text-3xl text-white">
                  {order.guestName}
                </p>
                <p className="mt-2 text-sm text-[#a79b88]">{order.phone}</p>
                <p className="mt-2 text-sm text-[#a79b88]">
                  {formatServiceTime(order.createdAt)}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="border border-[#3a3027] px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-[#d9ccb7]">
                    {order.fulfillment}
                  </span>
                  <span className="border border-[#3a3027] px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-[#d9ccb7]">
                    {orderStatusLabels[order.status]}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2">
                  {orderFlow.map((statusStep) => {
                    const isActive =
                      orderFlow.indexOf(statusStep) <= orderFlow.indexOf(order.status);

                    return (
                      <div key={statusStep} className="grid gap-2">
                        <span
                          className={`h-px ${
                            isActive ? "bg-[#d9ccb7]" : "bg-[#3a3027]"
                          }`}
                        />
                        <span
                          className={`text-[8px] uppercase tracking-[0.18em] ${
                            isActive ? "text-[#d9ccb7]" : "text-[#6f6255]"
                          }`}
                        >
                          {orderStatusLabels[statusStep]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(["accepted", "preparing", "completed"] as OrderStatus[]).map(
                    (nextStatus) => (
                      <button
                        key={nextStatus}
                        onClick={() => updateOrder(order.id, nextStatus)}
                        disabled={updatingId === order.id}
                        className={`border px-3 py-2 text-[9px] uppercase tracking-[0.2em] transition disabled:opacity-50 ${
                          order.status === nextStatus
                            ? "border-[#d9ccb7] bg-[#d9ccb7] text-black"
                            : "border-[#3a3027] text-[#a79b88] hover:border-white hover:text-white"
                        }`}
                        >
                        {orderStatusLabels[nextStatus]}
                      </button>
                    ),
                  )}
                </div>
                {order.address ? (
                  <p className="mt-4 text-sm text-[#a79b88]">{order.address}</p>
                ) : null}
                {order.note ? (
                  <p className="mt-2 text-sm text-[#a79b88]">{order.note}</p>
                ) : null}
                <div className="mt-5 grid gap-2">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.id}`}
                      className="flex justify-between border-b border-[#241d17] py-2 text-sm"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-[#d9ccb7]">
                        {formatPrice(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid content-between">
                <p className="font-serif text-5xl text-white">
                  {formatPrice(order.total)}
                </p>
                <div className="mt-5 space-y-2 text-sm text-[#a79b88]">
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
      <section className="mx-auto grid max-w-[1500px] gap-3 border-t border-[#4a382b] py-8 text-[10px] uppercase tracking-[0.24em] text-[#8f8374] sm:grid-cols-4">
        <p>Accepted orders: {acceptedOrders}</p>
        <p>Preparing: {preparingOrders}</p>
        <p>Completed orders: {completedOrders}</p>
        <p>Open reservations: {reservations.filter((item) => item.status === "new").length}</p>
      </section>
      <div className="mx-auto max-w-[1500px] pb-8 text-[10px] uppercase tracking-[0.24em] text-[#8f8374]">
        <Link href="/case-study" className="hover:text-white">
          View portfolio case study
        </Link>
      </div>
    </main>
  );
}
