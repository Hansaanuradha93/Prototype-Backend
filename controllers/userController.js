import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

/// Load environment variables
dotenv.config();

/// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/// Admin users
const ADMIN_EMAILS = ["hansaanuradha93@gmail.com"];

/// Controller: User Mode Allocation
const userMode = async (req, res) => {
  try {
    /// Extract email from request body
    const { email } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({ error: "Missing email field." });
    }

    /// Determine role
    const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";
    console.log(`👤 [User Mode] Checking user: ${email} (${role})`);

    /// Validate Supabase client
    if (!supabase) {
      return res.status(500).json({ error: "Supabase client not initialized properly." });
    }

    /// Step 1: Check if user already exists in Supabase
    const { data: existing, error: fetchError } = await supabase
      .from("users")
      .select("email, role, mode")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      /// PGRST116 → means no rows found; safe to ignore
      console.error("⚠️ [Supabase Fetch Error]:", fetchError.message);
      return res.status(500).json({ error: "Database fetch failed." });
    }

    if (existing) {
      console.log("✅ Existing user found:", existing);
      return res.status(200).json(existing);
    }

    /// Step 2: Assign mode for new users
    const mode = role === "user" ? (Math.random() < 0.5 ? "xai" : "baseline") : "xai"; // Admins default to XAI mode
    console.log(`🆕 New user → Assigned mode: ${mode}`);

    /// Step 3: Insert new user record
    const { data: inserted, error: insertError } = await supabase
      .from("users")
      .insert([{ email, role, mode }])
      .select()
      .single();

    if (insertError) {
      console.error("❌ [Supabase Insert Error]:", insertError.message);
      return res.status(500).json({ error: "User allocation failed." });
    }

    console.log("✅ [User Mode] User record created successfully:", inserted);

    return res.status(201).json(inserted);
  } catch (err) {
    /// Handle unexpected server errors
    console.error("❌ [User Mode Error]:", err.message);
    return res.status(500).json({
      error: "Unexpected server error while assigning user mode.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export default userMode;
