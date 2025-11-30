import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/* ------------------------------------------------------------------
   GET /api/v1/chat/message?email= → Fetch messages by email
------------------------------------------------------------------ */
const getMessagesByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Missing user email" });
    }

    const { data, error } = await supabase
      .from("chat_history")
      .select("id, sender, message, context, prediction, survey_completed, timestamp")
      .eq("user_email", email)
      .order("timestamp", { ascending: true });

    if (error) {
      console.error("❌ Supabase Error:", error.message);
      return res.status(500).json({ error: "Database error" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ Server Mode Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getMessagesByEmail };
