import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const supabase = createServerClient();

function toTimeOnly(iso: string): string {
  const d = new Date(iso);
  return d.toTimeString().slice(0, 8);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lawyerId } = await params;
    const dateStr = request.nextUrl.searchParams.get("date");
    if (!lawyerId || !dateStr) {
      return NextResponse.json(
        { message: "lawyer id and date (YYYY-MM-DD) are required" },
        { status: 400 }
      );
    }
    const dayStart = new Date(`${dateStr}T00:00:00`);
    const dayEnd = new Date(`${dateStr}T23:59:59`);
    if (isNaN(dayStart.getTime())) {
      return NextResponse.json({ message: "Invalid date" }, { status: 400 });
    }

    const { data: rows, error } = await supabase
      .from("bookings")
      .select("scheduled_at, duration_minutes")
      .eq("lawyer_id", lawyerId)
      .in("status", ["PENDING", "CONFIRMED"])
      .gte("scheduled_at", dayStart.toISOString())
      .lte("scheduled_at", dayEnd.toISOString());

    if (error) {
      console.error("Availability fetch error:", error);
      return NextResponse.json(
        { message: error.message || "Failed to fetch availability" },
        { status: 500 }
      );
    }

    const bookedSlots = (rows || []).map((r: { scheduled_at: string; duration_minutes: number }) => ({
      start: toTimeOnly(r.scheduled_at),
      durationMinutes: r.duration_minutes ?? 30,
    }));

    return NextResponse.json({ bookedSlots }, { status: 200 });
  } catch (e) {
    console.error("Availability error:", e);
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
