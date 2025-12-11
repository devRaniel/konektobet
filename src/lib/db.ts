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

export type Clinic = {
  id: string;
  name: string;
  address: string;
  contact_number: string;
  contact_email: string;
  website_link?: string | null;
  operating_hours?: object | null; // JSONB
  services?: object | null; // JSONB
  user_id: string;
  created_at?: string;
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
 * Creates a new clinic in the Supabase 'clinics' table.
 * @param clinicData The clinic data to insert.
 * @returns The newly created clinic object or null on error.
 */
export async function createClinic(
  clinicData: Omit<Clinic, "id" | "created_at">
): Promise<Clinic | null> {
  const { data, error } = await supabase
    .from("clinics")
    .insert(clinicData)
    .select()
    .single();

  if (error) {
    // e.g., '23505' for unique constraint violation if user_id already has a clinic
    console.error("Error creating clinic:", error);
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

/**
 * Finds a clinic by the user ID of its owner.
 * @param userId The ID of the user who owns the clinic.
 * @returns The clinic object or null if not found.
 */
export async function findClinicByUserId(userId: string): Promise<Clinic | null> {
  const { data, error } = await supabase
    .from("clinics")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error finding clinic by user ID:", error);
    return null;
  }

  return data;
}

/**
 * Retrieves all clinics from the database.
 * @returns An array of clinic objects or null on error.
 */
export async function getAllClinics(): Promise<Clinic[] | null> {
  const { data, error } = await supabase.from("clinics").select("*");

  if (error) {
    console.error("Error getting clinics:", error);
    return null;
  }

  return data;
}

/**
 * Updates a clinic's data based on its owner's user ID.
 * @param userId The ID of the user who owns the clinic.
 * @param clinicData The partial clinic data to update.
 * @returns The updated clinic object or null on error.
 */
export async function updateClinicByUserId(
  userId: string,
  clinicData: Partial<Omit<Clinic, "id" | "created_at" | "user_id">>
): Promise<Clinic | null> {
  const { data, error } = await supabase
    .from("clinics")
    .update(clinicData)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating clinic:", error);
    return null;
  }

  return data;
}

/**
 * Deletes a clinic based on its owner's user ID.
 * @param userId The ID of the user who owns the clinic.
 * @returns The deleted clinic object or null on error.
 */
export async function deleteClinicByUserId(userId: string): Promise<Clinic | null> {
  const { data, error } = await supabase
    .from("clinics")
    .delete()
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error deleting clinic:", error);
    return null;
  }

  return data;
}
