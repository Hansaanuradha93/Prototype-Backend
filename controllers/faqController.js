import dotenv from "dotenv";

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

/// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/// Initialize OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/// FAQ Handler
const faqAnswer = async (req, res) => {
  try {
    const { query, userEmail } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Missing query field" });
    }

    console.log(`💬 FAQ request from ${userEmail || "anonymous"}: ${query}`);

    /// Call OpenAI GPT model
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI financial assistant that answers user questions in a clear and concise way.",
        },
        { role: "user", content: query },
      ],
    });

    const answer = completion.choices[0]?.message?.content?.trim() || "No response generated.";

    /// Log the FAQ query to Supabase
    try {
      await supabase.from("faq_logs").insert([
        {
          user_email: userEmail || "anonymous",
          query,
          matched_question: null,
          similarity: 0.0,
          answer_source: "gpt-4o-mini",
          variant: "gpt-only",
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (logErr) {
      console.error("⚠️ Failed to log FAQ in Supabase:", logErr.message);
    }

    /// Send back response ---
    res.status(200).json({
      answer,
      source: "gpt-4o-mini",
    });
  } catch (err) {
    console.error("❌ FAQ endpoint error:", err.message);
    res.status(500).json({
      error: "Failed to get response from GPT model",
      details: err.message,
    });
  }
};

export default faqAnswer;
