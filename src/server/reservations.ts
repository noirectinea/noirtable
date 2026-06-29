import { getSupabaseClient } from "@/lib/supabase/client";

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

type ReservationRow = {
  id: string;
  created_at: string;
  status: ReservationStatus;
  guest_name: string;
  phone: string;
  party_size: string;
  preferred_time: string;
  note: string | null;
};

function toStoredReservation(row: ReservationRow): StoredReservation {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    guestName: row.guest_name,
    phone: row.phone,
    partySize: row.party_size,
    preferredTime: row.preferred_time,
    note: row.note ?? "",
  };
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
  const supabase = getSupabaseClient();

  if (!supabase) {
    return reservation;
  }

  const { error } = await supabase.from("reservations").insert({
    id: reservation.id,
    created_at: reservation.createdAt,
    status: reservation.status,
    guest_name: reservation.guestName,
    phone: reservation.phone,
    party_size: reservation.partySize,
    preferred_time: reservation.preferredTime,
    note: reservation.note || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return reservation;
}

export async function listReservations(accessToken?: string) {
  const supabase = getSupabaseClient(accessToken);

  if (!supabase) {
    return demoReservations;
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return demoReservations;
  }

  return data.length > 0
    ? data.map((row) => toStoredReservation(row as ReservationRow))
    : demoReservations;
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
  accessToken?: string,
) {
  const supabase = getSupabaseClient(accessToken);

  if (!supabase) {
    const reservation = demoReservations.find((item) => item.id === id);

    if (!reservation) {
      throw new Error("Reservation not found.");
    }

    return { ...reservation, status };
  }

  const { data, error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Reservation not found.");
  }

  return toStoredReservation(data as ReservationRow);
}
