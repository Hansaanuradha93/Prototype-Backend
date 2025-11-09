import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_KEY
// );

// --- Semantic FAQ query (proxy) ---
const faqAnswer = async (req, res) => {
  //
  res.status(200).json({ mode: "working" });
};

export default faqAnswer;
