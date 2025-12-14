import { NextRequest, NextResponse} from "next/server";
import { getClinicBySlug } from "@/lib/clinic/clinic";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const slug = searchParams.get("slug");

  if (!username || !slug) {
    return NextResponse.json(
      { error: "Username and slug query parameters are required" },
      { status: 400 }
    );
  }

  try {
    const clinic = await getClinicBySlug(slug, username);

    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    return NextResponse.json(clinic);
  } catch (error) {
    return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
  }
}