import { NextRequest, NextResponse } from "next/server";
import { getAllClinics } from "@/lib/clinic/clinic";

export async function GET(req: NextRequest) {
  try {
    // Fetch all clinics
    const clinics = await getAllClinics();
    return NextResponse.json(clinics, { status: 200 });
  } catch (err) {
    console.error("Get all clinics error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}