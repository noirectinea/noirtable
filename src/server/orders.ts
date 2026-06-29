import { menuItems } from "@/data/menu";
import { getSupabaseClient } from "@/lib/supabase/client";

export type OrderInputLine = {
  id: number;
  quantity: number;
  name?: string;
  category?: string;
  price?: number;
};

export type OrderInput = {
  guestName?: string;
  phone?: string;
  address?: string;
  fulfillment?: "Delivery" | "Pickup";
  note?: string;
  items?: OrderInputLine[];
};

export type StoredOrderLine = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type StoredOrder = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  guestName: string;
  phone: string;
  address: string;
  fulfillment: "Delivery" | "Pickup";
  note: string;
  items: StoredOrderLine[];
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
};

export type OrderStatus =
  | "new"
  | "accepted"
  | "preparing"
  | "completed"
  | "canceled";

const demoOrders: StoredOrder[] = [
  {
    id: "NT-DEMO-042",
    createdAt: "2026-06-24T18:42:00.000Z",
    status: "new",
    guestName: "Elena Morris",
    phone: "+1 212 555 0148",
    address: "34 Mercer Street, Apt 5B",
    fulfillment: "Delivery",
    note: "Please call from the entrance.",
    items: [
      {
        id: 18,
        name: "Saffron Lobster Pasta",
        category: "Pasta",
        price: 36,
        quantity: 1,
        lineTotal: 36,
      },
      {
        id: 25,
        name: "Charred Citrus Salmon",
        category: "Seafood",
        price: 29,
        quantity: 2,
        lineTotal: 58,
      },
    ],
    subtotal: 94,
    serviceFee: 8,
    deliveryFee: 6,
    total: 108,
  },
  {
    id: "NT-DEMO-041",
    createdAt: "2026-06-24T18:18:00.000Z",
    status: "preparing",
    guestName: "Nikolai Reed",
    phone: "+1 646 555 0192",
    address: "",
    fulfillment: "Pickup",
    note: "Guest requested pickup after 20:15.",
    items: [
      {
        id: 11,
        name: "Truffle Ribeye",
        category: "Signature",
        price: 42,
        quantity: 1,
        lineTotal: 42,
      },
      {
        id: 37,
        name: "Chocolate Souffle",
        category: "Desserts",
        price: 16,
        quantity: 2,
        lineTotal: 32,
      },
    ],
    subtotal: 74,
    serviceFee: 6,
    deliveryFee: 0,
    total: 80,
  },
  {
    id: "NT-DEMO-040",
    createdAt: "2026-06-24T17:55:00.000Z",
    status: "completed",
    guestName: "Maya Collins",
    phone: "+1 917 555 0134",
    address: "18 Crosby Street",
    fulfillment: "Delivery",
    note: "Leave with the lobby host.",
    items: [
      {
        id: 2,
        name: "Truffle Beef Tartare",
        category: "Starters",
        price: 22,
        quantity: 1,
        lineTotal: 22,
      },
      {
        id: 31,
        name: "Tomahawk for Two",
        category: "Grill",
        price: 86,
        quantity: 1,
        lineTotal: 86,
      },
      {
        id: 44,
        name: "Golden Negroni",
        category: "Drinks",
        price: 18,
        quantity: 2,
        lineTotal: 36,
      },
    ],
    subtotal: 144,
    serviceFee: 12,
    deliveryFee: 6,
    total: 162,
  },
];

function createOrderId() {
  return `NT-${Date.now().toString(36).toUpperCase()}`;
}

type OrderItemRow = {
  menu_item_id: number;
  name: string;
  category: string;
  price: number | string;
  quantity: number;
  line_total: number | string;
};

type OrderRow = {
  id: string;
  created_at: string;
  status: OrderStatus;
  guest_name: string;
  phone: string;
  address: string | null;
  fulfillment: "Delivery" | "Pickup";
  note: string | null;
  subtotal: number | string;
  service_fee: number | string;
  delivery_fee: number | string;
  total: number | string;
  order_items?: OrderItemRow[];
};

function toStoredOrder(row: OrderRow): StoredOrder {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    guestName: row.guest_name,
    phone: row.phone,
    address: row.address ?? "",
    fulfillment: row.fulfillment,
    note: row.note ?? "",
    items: (row.order_items ?? []).map((item) => ({
      id: item.menu_item_id,
      name: item.name,
      category: item.category,
      price: Number(item.price),
      quantity: item.quantity,
      lineTotal: Number(item.line_total),
    })),
    subtotal: Number(row.subtotal),
    serviceFee: Number(row.service_fee),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
  };
}

export function prepareOrder(input: OrderInput): StoredOrder {
  const fulfillment = input.fulfillment ?? "Delivery";
  const inputItems = input.items ?? [];

  if (inputItems.length === 0) {
    throw new Error("Add at least one dish before placing an order.");
  }

  if (!input.guestName?.trim() || !input.phone?.trim()) {
    throw new Error("Name and phone are required.");
  }

  if (fulfillment === "Delivery" && !input.address?.trim()) {
    throw new Error("Delivery address is required.");
  }

  const items = inputItems.map((line) => {
    const menuItem = menuItems.find((item) => item.id === line.id);
    const quantity = Math.max(1, Math.min(20, Math.trunc(line.quantity)));

    if (!menuItem && (!line.name || !line.price)) {
      throw new Error(`Unknown menu item: ${line.id}.`);
    }

    const name = line.name ?? menuItem!.name;
    const category = line.category ?? menuItem!.category;
    const price = Number(line.price ?? menuItem!.price);

    return {
      id: line.id,
      name,
      category,
      price,
      quantity,
      lineTotal: price * quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const serviceFee = fulfillment === "Pickup" ? 4 : 0;
  const deliveryFee = fulfillment === "Delivery" ? 7 : 0;

  return {
    id: createOrderId(),
    createdAt: new Date().toISOString(),
    status: "new",
    guestName: input.guestName.trim(),
    phone: input.phone.trim(),
    address: fulfillment === "Delivery" ? input.address?.trim() ?? "" : "",
    fulfillment,
    note: input.note?.trim() ?? "",
    items,
    subtotal,
    serviceFee,
    deliveryFee,
    total: subtotal + serviceFee + deliveryFee,
  };
}

export async function createOrder(input: OrderInput) {
  const order = prepareOrder(input);
  const supabase = getSupabaseClient();

  if (!supabase) {
    return order;
  }

  const { error: orderError } = await supabase.from("orders").insert({
    id: order.id,
    created_at: order.createdAt,
    status: order.status,
    guest_name: order.guestName,
    phone: order.phone,
    address: order.address || null,
    fulfillment: order.fulfillment,
    note: order.note || null,
    subtotal: order.subtotal,
    service_fee: order.serviceFee,
    delivery_fee: order.deliveryFee,
    total: order.total,
  });

  if (orderError) {
    throw new Error(orderError.message);
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    order.items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      line_total: item.lineTotal,
    })),
  );

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return order;
}

export async function listOrders() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return demoOrders;
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return demoOrders;
  }

  return data.length > 0
    ? data.map((row) => toStoredOrder(row as OrderRow))
    : demoOrders;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const order = demoOrders.find((item) => item.id === id);

    if (!order) {
      throw new Error("Order not found.");
    }

    return { ...order, status };
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("*, order_items(*)")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Order not found.");
  }

  return toStoredOrder(data as OrderRow);
}
