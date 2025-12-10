import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * Creates a JSON Web Token (JWT).
 * @param payload - The data to include in the token (e.g., user ID, username).
 * @returns The signed JWT string.
 * @throws Will throw an error if JWT_SECRET is not set in environment variables.
 */
export function createToken(payload: object): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set.");
  }

  // Token expires in 1 hour. You can adjust this value.
  return jwt.sign(payload, secret, { expiresIn: "7d" }); // 7 days
}

/**
 * Sets a secure, HTTP-only cookie on the response.
 * @param response - The NextResponse object to modify.
 * @param token - The token string to set as the cookie value.
 */
export function setCookie(response: NextResponse, token: string): void {
  response.cookies.set("session_token", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: "/", // Cookie is available for all paths
    sameSite: "lax", // Provides a balance between security and usability for CSRF protection
  });
}

/**
 * Verifies a JSON Web Token (JWT).
 * @param token - The token string to verify.
 * @returns The decoded payload if the token is valid, otherwise null.
 */
export function verifyToken(token: string): jwt.JwtPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET environment variable is not set.");
    return null;
  }
  try {
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
}