import dotenv from "dotenv";

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

/// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/// Helper: Generate GPT Answer
async function generateGptAnswer(query) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a professional financial assistant. Answer questions clearly, accurately, and concisely.",
      },
      { role: "user", content: query },
    ],
  });

  const answer =
    completion.choices?.[0]?.message?.content?.trim() ||
    "I'm sorry, I couldn’t generate a response at this time.";

  return answer;
}

/// Helper: Log FAQ to Supabase
async function logFaqQuery(email, query) {
  try {
    const { error } = await supabase.from("faq_logs").insert([
      {
        user_email: email,
        query,
        matched_question: null,
        similarity: 0.0,
        answer_source: "gpt-4o-mini",
        variant: "gpt-only",
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    console.log("🗂️ [Supabase Log] FAQ query logged successfully.");
  } catch (err) {
    console.error("⚠️ [Supabase Log Error]:", err.message);
  }
}

/// FAQ Handler
const faqAnswer = async (req, res) => {
  const { query, userEmail } = req.body;

  /// Validate request body
  if (!query || !query.trim()) {
    return res.status(400).json({ error: "Missing or empty 'query' field." });
  }

  const email = userEmail?.trim() || "anonymous";
  console.log(`💬 [FAQ Request] From: ${email} | Query: "${query}"`);

  try {
    /// Generate GPT response
    const answer = await generateGptAnswer(query);

    /// Log to Supabase (non-blocking, async)
    logFaqQuery(email, query);

    /// Send response
    return res.status(200).json({
      answer,
      source: "gpt-4o-mini",
    });
  } catch (error) {
    /// Handle GPT or other runtime errors
    console.error("❌ [FAQ Endpoint Error]:", error.message);

    /// Send response
    return res.status(500).json({
      error: "Failed to generate a response from the GPT model.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export default faqAnswer;
