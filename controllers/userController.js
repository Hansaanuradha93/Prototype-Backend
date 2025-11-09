import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

/// Load environment variables
dotenv.config();

/// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/// Admin users
const ADMIN_EMAILS = ["hansaanuradha93@gmail.com"];

/// Helper: Fetch user by email
async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("email, role, mode")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("⚠️ [Supabase Fetch Error]:", error.message);
    throw new Error("Database fetch failed");
  }

  return data;
}

/// Helper: Insert a new user with assigned mode
async function createNewUser(email, role) {
  const mode = role === "user" ? (Math.random() < 0.5 ? "xai" : "baseline") : "xai";
  console.log(`🆕 New user → Assigned mode: ${mode}`);

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, role, mode }])
    .select()
    .single();

  if (error) {
    console.error("❌ [Supabase Insert Error]:", error.message);
    throw new Error("User allocation failed");
  }

  console.log("✅ [User Mode] User record created successfully:", data);
  return data;
}

/// User Mode Allocation
const userMode = async (req, res) => {
  const { email } = req.body;

  /// Validate request
  if (!email || email.trim() === "") {
    return res.status(400).json({ error: "Missing email field." });
  }

  const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";
  console.log(`👤 [User Mode] Checking user: ${email} (${role})`);

  /// Ensure Supabase client
  if (!supabase) {
    return res.status(500).json({ error: "Supabase client not initialized properly." });
  }

  try {
    /// Step 1: Fetch existing user
    const existing = await getUserByEmail(email);

    if (existing) {
      console.log("✅ Existing user found:", existing);
      return res.status(200).json(existing);
    }

    /// Step 2: Create new user record
    const inserted = await createNewUser(email, role);
    return res.status(201).json(inserted);
  } catch (err) {
    /// Step 3: Handle unexpected server errors
    console.error("❌ [User Mode Error]:", err.message);
    return res.status(500).json({
      error: "Unexpected server error while assigning user mode.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export default userMode;
