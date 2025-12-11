import { supabase } from "../supabaseClient";

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

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }

  return data;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("username", username)
    .single();

  if (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }

  return data;
}