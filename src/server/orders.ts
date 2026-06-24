import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { menuItems } from "@/data/menu";

export type OrderInputLine = {
  id: number;
  quantity: number;
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

export type OrderStatus = "new" | "accepted" | "preparing" | "completed";

const ordersPath = path.join(process.cwd(), ".data", "orders.json");

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

async function readOrders() {
  try {
    const file = await readFile(ordersPath, "utf8");
    const orders = JSON.parse(file) as StoredOrder[];

    return orders.length > 0 ? orders : demoOrders;
  } catch {
    return demoOrders;
  }
}

async function writeOrders(orders: StoredOrder[]) {
  await mkdir(path.dirname(ordersPath), { recursive: true });
  await writeFile(ordersPath, JSON.stringify(orders, null, 2));
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

    if (!menuItem) {
      throw new Error(`Unknown menu item: ${line.id}.`);
    }

    return {
      id: menuItem.id,
      name: menuItem.name,
      category: menuItem.category,
      price: menuItem.price,
      quantity,
      lineTotal: menuItem.price * quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const serviceFee = Math.round(subtotal * 0.08);
  const deliveryFee = fulfillment === "Delivery" ? 6 : 0;

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
  const orders = await readOrders();

  await writeOrders([order, ...orders].slice(0, 100));

  return order;
}

export async function listOrders() {
  return readOrders();
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const orders = await readOrders();
  const order = orders.find((item) => item.id === id);

  if (!order) {
    throw new Error("Order not found.");
  }

  order.status = status;
  await writeOrders(orders);

  return order;
}
