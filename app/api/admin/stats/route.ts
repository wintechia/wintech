import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // In a real app, this would fetch from the database
  // For now, return demo stats
  return NextResponse.json({
    totalLeads: 12,
    totalChats: 48,
    totalAppointments: 8,
    conversionRate: 67,
  });
}
