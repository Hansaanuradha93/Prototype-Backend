import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const loanTrustSurvey = async (req, res) => {
  try {
    const { user_email, variant, prediction, trust, feedback } = req.body || {};

    // --- Validate required fields ---
    if (!user_email || !variant || !prediction || !trust) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const requiredKeys = [
      "trust_score",
      "reasoning_confidence_score",
      "accuracy_score",
      "understanding_score",
      "repeat_usage_score",
      "comfort_score",
    ];

    // Validate each score is 1–5
    for (const key of requiredKeys) {
      const v = trust[key];
      if (typeof v !== "number" || v < 1 || v > 5) {
        return res.status(400).json({ error: `Invalid value for ${key}` });
      }
    }

    // --- Insert into Supabase ---
    const { error } = await supabase.from("loan_trust_survey").insert({
      user_email,
      variant,
      prediction,

      trust_score: trust.trust_score,
      reasoning_confidence_score: trust.reasoning_confidence_score,
      accuracy_score: trust.accuracy_score,
      understanding_score: trust.understanding_score,
      repeat_usage_score: trust.repeat_usage_score,
      comfort_score: trust.comfort_score,

      comment: feedback || null,
    });

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return res.status(500).json({
        error: "Failed to save survey response",
        details: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Thank you! Your feedback has been recorded.",
    });
  } catch (err) {
    console.error("❌ loanTrustSurvey error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export default loanTrustSurvey;
