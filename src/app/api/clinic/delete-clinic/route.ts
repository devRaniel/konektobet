import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utilities/TokenUtilities";
import { deleteClinicByUserId } from "@/lib/clinic/clinic";

export async function DELETE(req: NextRequest) {
  // 1. Authenticate and authorize user
  const tokenCookie = req.cookies.get("session_token");
  if (!tokenCookie) {
    return NextResponse.json({ error: "Unauthorized: No session token" }, { status: 401 });
  }

  const payload = verifyToken(tokenCookie.value);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
  }

  if (payload.role !== 2) { // Must be a 'clinic' user
    return NextResponse.json({ error: "Forbidden: User does not have clinic privileges" }, { status: 403 });
  }

  try {
    const deletedClinic = await deleteClinicByUserId(payload.id);

    if (!deletedClinic) {
      return NextResponse.json({ error: "Failed to delete clinic or clinic not found for this user." }, { status: 404 });
    }

    return NextResponse.json({ message: "Clinic deleted successfully", clinic: deletedClinic }, { status: 200 });
  } catch (err) {
    console.error("Delete clinic error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}