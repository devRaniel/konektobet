import { NextRequest, NextResponse } from "next/server";
import { findUserByUsername, findUserByEmail, User } from "@/lib/db";
import bcrypt from "bcrypt";
import { createToken, setCookie } from "@/utilities/TokenUtilities";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    // In the frontend, the field can be named 'identifier' or 'username'
    // but we receive it as 'username' here.

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Allow login with either username or email
    let user: User | null = null;
    if (username.includes('@')) {
      user = await findUserByEmail(username);
    } else {
      user = await findUserByUsername(username);
    }
    if (!user) return NextResponse.json({ error: "Username or password is incorrect" }, { status: 401 });
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = createToken({ id: user.id, username: user.username, role: user.role });

    const response = NextResponse.json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
    setCookie(response, token);

    return response;

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Invalid JSON or server error" }, { status: 500 });
  }
}
