import { supabase } from "./supabaseClient";

export type User = {
  id: string;
  username: string;
  name: string;
  role: 0 | 1 | 2; // 0: admin, 1: customer, 2: clinic
  number: string;
  email: string;
  password: string;
  createdAt?: string;
};

/**
 * Creates a new user in the Supabase 'users' table.
 * @param userData The user data to insert (e.g., username, email, hashed password).
 * @returns The newly created user object or null on error.
 */
export async function createUser(
  userData: Omit<User, "id" | "createdAt">
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .insert(userData)
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    return null;
  }

  return data;
}

/**
 * Finds a user in the Supabase 'users' table by their username.
 * @param username The username to search for.
 * @returns The user object or null if not found.
 */
export async function findUserByUsername(username: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116 means no rows found
    console.error("Error finding user by username:", error);
    return null;
  }

  return data;
}

/**
 * Finds a user in the Supabase 'users' table by their email.
 * @param email The email to search for.
 * @returns The user object or null if not found.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116 means no rows found
    console.error("Error finding user by email:", error);
    return null;
  }

  return data;
}
