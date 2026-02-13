import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const supabase = createServerClient();

function getClientIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  let token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    const cookieHeader = request.headers.get("cookie");
    const match = cookieHeader?.match(/\bauth-token=([^;]+)/);
    token = match ? decodeURIComponent(match[1].trim()) : undefined;
  }
  if (!token?.startsWith("supabase-token-")) return null;
  return token.replace("supabase-token-", "");
}

export async function GET(request: NextRequest) {
  try {
    const clientId = getClientIdFromToken(request);
    if (!clientId) {
      return NextResponse.json({ message: "Please sign in to view bookings." }, { status: 401 });
    }

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("id, lawyer_id, scheduled_at, duration_minutes, status, consultation_fee, notes, created_at")
      .eq("client_id", clientId)
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("Bookings fetch error:", error);
      return NextResponse.json(
        { message: error.message || "Failed to fetch bookings" },
        { status: 500 }
      );
    }

    const rows = bookings || [];
    const lawyerIds = [...new Set(rows.map((b: any) => b.lawyer_id))];
    const { data: usersData } = await supabase
      .from("users")
      .select("id, full_name")
      .in("id", lawyerIds);
    const nameMap = new Map((usersData || []).map((u: any) => [String(u.id), u.full_name]));

    const now = new Date().toISOString();
    const list = rows.map((b: any) => ({
      id: b.id,
      lawyerId: b.lawyer_id,
      lawyer: nameMap.get(String(b.lawyer_id)) || "Advocate",
      scheduledAt: b.scheduled_at,
      durationMinutes: b.duration_minutes,
      status: b.status,
      consultationFee: b.consultation_fee,
      notes: b.notes,
      createdAt: b.created_at,
    }));

    const upcoming = list.filter((b: any) => b.scheduledAt >= now);
    const past = list.filter((b: any) => b.scheduledAt < now);

    return NextResponse.json(
      { data: list, upcoming, past },
      { status: 200 }
    );
  } catch (e) {
    console.error("Bookings user GET error:", e);
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
