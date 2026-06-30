import { NextResponse } from "next/server";
import {
  createStaffMenuItem,
  listStaffMenuItems,
  updateStaffMenuItem,
  type MenuItemInput,
} from "@/server/menu-admin";
import { requireStaffAuth } from "@/server/staff-auth";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Menu update failed.";
}

export async function GET(request: Request) {
  const auth = await requireStaffAuth(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const items = await listStaffMenuItems(auth.accessToken);
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ message: errorMessage(error) }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const auth = await requireStaffAuth(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const body = (await request.json()) as MenuItemInput;
    const item = await createStaffMenuItem(body, auth.accessToken);
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ message: errorMessage(error) }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireStaffAuth(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const body = (await request.json()) as MenuItemInput;
    const item = await updateStaffMenuItem(body, auth.accessToken);
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ message: errorMessage(error) }, { status: 400 });
  }
}
