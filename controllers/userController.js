import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const ADMIN_EMAILS = ["hansaanuradha93@gmail.com"];

/* ------------------------------------------------------------------
   Helper: Fetch user by email
------------------------------------------------------------------ */
async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("email, role, mode")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("⚠️ [Fetch Error]:", error.message);
    throw new Error("Database fetch failed");
  }

  return data;
}

/* ------------------------------------------------------------------
   Helper: Create new user
------------------------------------------------------------------ */
async function createNewUser(email, role) {
  const mode = role === "user" ? (Math.random() < 0.5 ? "xai" : "baseline") : "xai";

  console.log(`🆕 Creating new user (${email}) → mode: ${mode}`);

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, role, mode }])
    .select()
    .single();

  if (error) {
    console.error("❌ Insert Error:", error.message);
    throw new Error("User creation failed");
  }

  return data;
}

/* ------------------------------------------------------------------
   GET /api/v1/users → Fetch ALL users
------------------------------------------------------------------ */
const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("email, role, mode");

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ [Get Users Error]:", err.message);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

/* ------------------------------------------------------------------
   POST /api/v1/users → Create user (if not exists)
------------------------------------------------------------------ */
const createUser = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";

  try {
    const existing = await getUserByEmail(email);

    if (existing) {
      return res.status(200).json(existing);
    }

    const created = await createNewUser(email, role);
    return res.status(201).json(created);
  } catch (err) {
    console.error("❌ Create User Error:", err.message);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

/* ------------------------------------------------------------------
   GET /api/v1/users/mode?email=...
------------------------------------------------------------------ */
const getUserMode = async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ email: user.email, mode: user.mode, role: user.role });
  } catch (err) {
    console.error("❌ Fetch User Mode Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch user mode" });
  }
};

/* ------------------------------------------------------------------
   POST /api/v1/users/mode → Update user mode
------------------------------------------------------------------ */
const updateUserMode = async (req, res) => {
  const { email, mode } = req.body;

  if (!email || !mode) return res.status(400).json({ error: "Email and mode are required" });

  if (!["xai", "baseline"].includes(mode))
    return res.status(400).json({ error: "Mode must be xai or baseline" });

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ mode })
      .eq("email", email)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ success: true, updated: data });
  } catch (err) {
    console.error("❌ Update Mode Error:", err.message);
    return res.status(500).json({ error: "Failed to update user mode" });
  }
};

export { getAllUsers, createUser, getUserMode, updateUserMode };
