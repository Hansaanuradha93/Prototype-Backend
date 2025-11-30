import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/* ------------------------------------------------------------------
   POST /api/v1/chat/message
------------------------------------------------------------------ */
const createMessage = async (req, res) => {
  try {
    const { email, sender, message, variant } = req.body;

    if (!email || !sender || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { error } = await supabase.from("chat_history").insert({
      user_email: email,
      sender,
      message,
      variant,
    });

    if (error) {
      console.error("❌ Supabase Error:", error.message);
      return res.status(500).json({ error: "Failed to save chat message" });
    }

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("❌ saveChatMessage error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/* ------------------------------------------------------------------
   GET /api/v1/chat/
------------------------------------------------------------------ */
const getAllMessages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("chat_history")
      .select("id, sender, user_email, message, context, prediction, survey_completed, timestamp")
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

/* ------------------------------------------------------------------
   GET /api/v1/chat/{{email}}
------------------------------------------------------------------ */
const getMessagesByEmail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing user email" });
    }

    const { data, error } = await supabase
      .from("chat_history")
      .select("id, sender, message, context, prediction, survey_completed, timestamp")
      .eq("user_email", id)
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

/* ------------------------------------------------------------------
   Patch /api/v1/chat/{{id}}
------------------------------------------------------------------ */
const updateMessagesByID = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }

    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ error: "Invalid or empty payload" });
    }

    const { data, error } = await supabase
      .from("chat_history")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase update error:", error.message);
      return res.status(500).json({ error: "Failed to update chat history" });
    }

    return res.status(200).json({
      success: true,
      message: "Record updated",
      data,
    });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { createMessage, getAllMessages, getMessagesByEmail, updateMessagesByID };
