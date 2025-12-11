import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utilities/TokenUtilities";
import { createClinic } from "@/lib/db";

export async function POST(req: NextRequest) {
  // 1. Authenticate the user by verifying the token
  const tokenCookie = req.cookies.get("session_token");
  if (!tokenCookie) {
    return NextResponse.json({ error: "Unauthorized: No session token" }, { status: 401 });
  }

  const payload = verifyToken(tokenCookie.value);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
  }

  // 2. Authorize the user based on their role
  if (payload.role !== 2) { // Must be a 'clinic' user
    return NextResponse.json({ error: "Forbidden: User does not have clinic privileges" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      name,
      address,
      contact_number,
      contact_email,
      website_link,
      operating_hours,
      services,
    } = body;

    // 3. Validate the request body
    if (!name || !address || !contact_number || !contact_email) {
      return NextResponse.json({ error: "Missing required fields: name, address, contact_number, contact_email" }, { status: 400 });
    }

    // 4. Create the clinic record
    const newClinic = await createClinic({
      name,
      address,
      contact_number,
      contact_email,
      website_link: website_link || null,
      operating_hours: operating_hours || null,
      services: services || null,
      user_id: payload.id, // Securely set user_id from the token
    });

    if (!newClinic) {
      // This could happen if the user_id already has a clinic (unique constraint violation)
      return NextResponse.json({ error: "Failed to create clinic. This user may already have a clinic registered." }, { status: 500 });
    }

    // 5. Return the successful response
    return NextResponse.json(newClinic, { status: 201 });

  } catch (err) {
    console.error("Create clinic error:", err);
    return NextResponse.json({ error: "Invalid JSON or server error" }, { status: 500 });
  }
}