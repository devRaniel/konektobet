import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utilities/TokenUtilities";
import { findClinicByUserId } from "@/lib/db";

export async function GET(req: NextRequest) {
  // 1. Authenticate the user by verifying the token
  const tokenCookie = req.cookies.get("session_token");
  if (!tokenCookie) {
    return NextResponse.json(
      { error: "Unauthorized: No session token" },
      { status: 401 }
    );
  }

  const payload = verifyToken(tokenCookie.value);
  if (!payload) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }

  // 2. Authorize the user based on their role
  if (payload.role !== 2) {
    // Must be a 'clinic' user
    return NextResponse.json(
      { error: "Forbidden: User does not have clinic privileges" },
      { status: 403 }
    );
  }

  try {
    // 3. Fetch the clinic associated with the user
    const clinic = await findClinicByUserId(payload.id);

    if (!clinic) {
      return NextResponse.json(
        { error: "Clinic not found for this user." },
        { status: 404 }
      );
    }

    // 4. Return the clinics
    return NextResponse.json(clinic, { status: 200 });

  } catch (err) {
    console.error("Get clinic error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}