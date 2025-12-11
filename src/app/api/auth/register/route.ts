import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByUsername, findUserByEmail } from "@/lib/db";
import bcrypt from "bcrypt";
import { createToken, setCookie } from "@/utilities/TokenUtilities";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      username,
      email,
      name,
      number,
      password,
      role, // New: role can be passed from the frontend
      verifyPassword,
     } = body;

    // More robust validation for missing fields
    const requiredFields = ['username', 'email', 'name', 'number', 'password', 'verifyPassword'];
    for (const field of requiredFields) {
      if (!body[field]) {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('Password', ' Password');
        return NextResponse.json({ error: `${fieldName} is required` }, { status: 400 });
      }
    }

    // Determine and validate the role
    const userRole = role === 2 ? 2 : 1; // Default to 'customer' if role is not explicitly 2

    // Security check: Prevent anyone from registering as an admin
    if (role === 0) {
      return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ error: "Password must contain at least one uppercase letter" }, { status: 400 });
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json({ error: "Password must contain at least one number" }, { status: 400 });
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return NextResponse.json({ error: "Password must contain at least one special character" }, { status: 400 });
    }
    const letterCount = (password.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 3) {
      return NextResponse.json({ error: "Password must contain at least three letters" }, { status: 400 });
    }

    if (password !== verifyPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const existingUserByUsername = await findUserByUsername(username);
    if (existingUserByUsername) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 409 }); 
    }

    const existingUserByEmail = await findUserByEmail(email);
    if (existingUserByEmail) {
      return NextResponse.json({ error: "Email is already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      username,
      email,
      name,
      number,
      role: userRole, // Set role based on input or default to 1
      password: hashedPassword,
    });

    if (!user) {
      return NextResponse.json({ error: "Could not create user due to a database error." }, { status: 500 });
    }

    // Create a token with non-sensitive user data
    const token = createToken({ id: user.id, username: user.username, role: user.role });

    // Create a response and set the cookie
    const response = NextResponse.json({ id: user.id, username: user.username, email: user.email, role: user.role }, { status: 201 });
    setCookie(response, token);

    return response;

  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Invalid JSON or server error" }, { status: 500 });
  }
}
