import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const supabase = createServerClient();

function getClientIdFromToken(request: NextRequest): string | null {
  // Prefer Authorization header
  const authHeader = request.headers.get("authorization");
  let token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  // Fall back to auth-token cookie (browser sends cookies, may not send Authorization)
  if (!token) {
    const cookieHeader = request.headers.get("cookie");
    const match = cookieHeader?.match(/\bauth-token=([^;]+)/);
    token = match ? decodeURIComponent(match[1].trim()) : null;
  }
  if (!token?.startsWith("supabase-token-")) return null;
  return token.replace("supabase-token-", "");
}

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientIdFromToken(request);
    if (!clientId) {
      return NextResponse.json({ message: "Please sign in to book a consultation." }, { status: 401 });
    }

    const body = await request.json();
    const { lawyerId, scheduledDate, scheduledTime, durationMinutes, consultationFee, notes } = body;

    if (!lawyerId || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { message: "Missing required fields: lawyerId, scheduledDate, scheduledTime" },
        { status: 400 }
      );
    }

    const fee = consultationFee != null ? parseFloat(consultationFee) : 0;
    const duration = durationMinutes != null ? parseInt(durationMinutes, 10) : 30;

    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    if (isNaN(Date.parse(scheduledAt))) {
      return NextResponse.json({ message: "Invalid date or time" }, { status: 400 });
    }

    const dayStart = new Date(`${scheduledDate}T00:00:00`);
    const dayEnd = new Date(`${scheduledDate}T23:59:59`);
    const { data: existing } = await supabase
      .from("bookings")
      .select("id, scheduled_at, duration_minutes")
      .eq("lawyer_id", lawyerId)
      .in("status", ["PENDING", "CONFIRMED"])
      .gte("scheduled_at", dayStart.toISOString())
      .lte("scheduled_at", dayEnd.toISOString());

    const reqStart = new Date(scheduledAt).getTime();
    const reqEnd = reqStart + duration * 60 * 1000;
    const overlap = (existing || []).some((row: { scheduled_at: string; duration_minutes: number }) => {
      const start = new Date(row.scheduled_at).getTime();
      const end = start + (row.duration_minutes ?? 30) * 60 * 1000;
      return reqStart < end && reqEnd > start;
    });
    if (overlap) {
      return NextResponse.json(
        { message: "This time slot is no longer available. Please choose another." },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        client_id: clientId,
        lawyer_id: lawyerId,
        scheduled_at: scheduledAt,
        duration_minutes: duration,
        status: "CONFIRMED",
        consultation_fee: fee,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Booking insert error:", error);
      return NextResponse.json(
        { message: error.message || "Failed to create booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data, message: "Booking confirmed." }, { status: 201 });
  } catch (e) {
    console.error("Bookings POST error:", e);
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
