import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";

type StaffAuthResult =
  | { accessToken: string; response?: never }
  | { accessToken?: never; response: NextResponse };

export async function requireStaffAuth(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const supabase = getSupabaseClient();

  if (!supabase || !token) {
    return {
      response: NextResponse.json(
        { message: "Staff login required." },
        { status: 401 },
      ),
    } satisfies StaffAuthResult;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return {
      response: NextResponse.json(
        { message: "Staff login required." },
        { status: 401 },
      ),
    } satisfies StaffAuthResult;
  }

  return { accessToken: token } satisfies StaffAuthResult;
}
