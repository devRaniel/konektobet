import { NextRequest, NextResponse } from "next/server";
import { findUserByUsername } from "@/lib/db";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const user = await findUserByUsername(username);
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = signToken({ id: user.id, username: user.username });

    return NextResponse.json({ access: token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
