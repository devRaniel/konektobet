import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByUsername } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    // 1. Basic input validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 2. Check if the user already exists
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 409 }); // 409 Conflict is more appropriate
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the new user with the hashed password
    const user = await createUser({ username, email, password: hashedPassword });

    // 5. Handle potential creation errors (e.g., duplicate email)
    if (!user) {
      return NextResponse.json({ error: "Could not create user. The email might be taken." }, { status: 409 });
    }

    // 6. Return the newly created user's public data
    return NextResponse.json({ id: user.id, username: user.username, email: user.email }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Invalid JSON or server error" }, { status: 500 });
  }
}
