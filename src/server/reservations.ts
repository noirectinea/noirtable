import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type ReservationInput = {
  guestName?: string;
  phone?: string;
  partySize?: string;
  preferredTime?: string;
  note?: string;
};

export type StoredReservation = {
  id: string;
  createdAt: string;
  status: ReservationStatus;
  guestName: string;
  phone: string;
  partySize: string;
  preferredTime: string;
  note: string;
};

export type ReservationStatus = "new" | "confirmed" | "declined";

const reservationsPath = path.join(process.cwd(), ".data", "reservations.json");

const demoReservations: StoredReservation[] = [
  {
    id: "RS-DEMO-014",
    createdAt: "2026-06-24T17:20:00.000Z",
    status: "new",
    guestName: "Sofia Laurent",
    phone: "+1 212 555 0177",
    partySize: "2 guests",
    preferredTime: "Tonight, 21:00",
    note: "Corner table if available.",
  },
  {
    id: "RS-DEMO-013",
    createdAt: "2026-06-24T15:46:00.000Z",
    status: "confirmed",
    guestName: "Daniel Price",
    phone: "+1 646 555 0116",
    partySize: "4 guests",
    preferredTime: "Friday, 20:30",
    note: "Anniversary dinner.",
  },
  {
    id: "RS-DEMO-012",
    createdAt: "2026-06-24T12:10:00.000Z",
    status: "declined",
    guestName: "Anika Shah",
    phone: "+1 917 555 0164",
    partySize: "6 guests",
    preferredTime: "Saturday, 22:00",
    note: "Room was already full.",
  },
];

function createReservationId() {
  return `RS-${Date.now().toString(36).toUpperCase()}`;
}

async function readReservations() {
  try {
    const file = await readFile(reservationsPath, "utf8");
    const reservations = JSON.parse(file) as StoredReservation[];

    return reservations.length > 0 ? reservations : demoReservations;
  } catch {
    return demoReservations;
  }
}

async function writeReservations(reservations: StoredReservation[]) {
  await mkdir(path.dirname(reservationsPath), { recursive: true });
  await writeFile(reservationsPath, JSON.stringify(reservations, null, 2));
}

export function prepareReservation(input: ReservationInput): StoredReservation {
  if (!input.guestName?.trim() || !input.phone?.trim()) {
    throw new Error("Name and phone are required.");
  }

  return {
    id: createReservationId(),
    createdAt: new Date().toISOString(),
    status: "new",
    guestName: input.guestName.trim(),
    phone: input.phone.trim(),
    partySize: input.partySize?.trim() || "2 guests",
    preferredTime: input.preferredTime?.trim() || "Tonight",
    note: input.note?.trim() ?? "",
  };
}

export async function createReservation(input: ReservationInput) {
  const reservation = prepareReservation(input);
  const reservations = await readReservations();

  await writeReservations([reservation, ...reservations].slice(0, 100));

  return reservation;
}

export async function listReservations() {
  return readReservations();
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
) {
  const reservations = await readReservations();
  const reservation = reservations.find((item) => item.id === id);

  if (!reservation) {
    throw new Error("Reservation not found.");
  }

  reservation.status = status;
  await writeReservations(reservations);

  return reservation;
}
