import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";

export async function requireStaffAuth(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const supabase = getSupabaseClient();

  if (!supabase || !token) {
    return NextResponse.json({ message: "Staff login required." }, { status: 401 });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return NextResponse.json({ message: "Staff login required." }, { status: 401 });
  }

  return null;
}
