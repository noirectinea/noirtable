import { NextResponse } from "next/server";
import {
  createOrder,
  listOrders,
  updateOrderStatus,
  type OrderInput,
  type OrderStatus,
} from "@/server/orders";

export async function GET() {
  const orders = await listOrders();

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderInput;
    const order = await createOrder(body);

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      message: "Order received.",
      total: order.total,
      order,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "The order could not be saved.",
      },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      status?: OrderStatus;
    };

    if (!body.id || !body.status) {
      throw new Error("Order id and status are required.");
    }

    if (!["new", "accepted", "preparing", "completed"].includes(body.status)) {
      throw new Error("Unsupported order status.");
    }

    const order = await updateOrderStatus(body.id, body.status);

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "The order could not be updated.",
      },
      { status: 400 },
    );
  }
}
