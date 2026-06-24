import { NextResponse } from "next/server";
import {
  createReservation,
  listReservations,
  type ReservationInput,
  type ReservationStatus,
  updateReservationStatus,
} from "@/server/reservations";

export async function GET() {
  const reservations = await listReservations();

  return NextResponse.json({ reservations });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReservationInput;
    const reservation = await createReservation(body);

    return NextResponse.json({
      reservationId: reservation.id,
      status: reservation.status,
      message: "Reservation request received.",
      reservation,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "The reservation could not be saved.",
      },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      status?: ReservationStatus;
    };

    if (!body.id || !body.status) {
      throw new Error("Reservation id and status are required.");
    }

    if (!["new", "confirmed", "declined"].includes(body.status)) {
      throw new Error("Unsupported reservation status.");
    }

    const reservation = await updateReservationStatus(body.id, body.status);

    return NextResponse.json({ reservation });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "The reservation could not be updated.",
      },
      { status: 400 },
    );
  }
}
