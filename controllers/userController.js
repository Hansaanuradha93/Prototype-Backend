import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_KEY
// );

// --- User mode allocation ---
const userMode = async (req, res, next) => {
  res.status(200).json({ mode: "working" });
};

export default userMode;
