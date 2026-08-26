import { NextRequest, NextResponse } from "next/server";
import { checkFreeSlots, createAppointment, getMockBookings } from "@/lib/calendar";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate") || undefined;
  const duration = Number(searchParams.get("duration") || 30);

  const slots = await checkFreeSlots(startDate, duration);
  const existingBookings = getMockBookings();

  return NextResponse.json({
    success: true,
    availableSlots: slots,
    existingBookings,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const booking = await createAppointment(body, body.businessName || "Demo Bedrijf");
    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
