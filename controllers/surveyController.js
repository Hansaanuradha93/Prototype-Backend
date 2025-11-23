import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

/// Load environment variables
dotenv.config();

/// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const loanTrustSurvey = async (req, res) => {
  try {
    const { user_email, variant, prediction, trust, feedback } = req.body || {};

    if (!user_email || !variant || !prediction || !trust) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate 1–5 Likert scores
    const keys = [
      "trust_score",
      "accuracy_score",
      "clarity_score",
      "confidence_score",
      "repeat_usage_score",
    ];

    for (const key of keys) {
      const v = trust[key];
      if (typeof v !== "number" || v < 1 || v > 5) {
        return res.status(400).json({ error: `Invalid ${key} value` });
      }
    }

    // Insert into Supabase table
    const { error } = await supabase.from("loan_trust_survey").insert({
      user_email,
      variant,
      prediction,
      trust_score: trust.trust_score,
      accuracy_score: trust.accuracy_score,
      clarity_score: trust.clarity_score,
      confidence_score: trust.confidence_score,
      repeat_usage_score: trust.repeat_usage_score,
      comment: feedback || null,
    });

    if (error) {
      console.error("❌ Supabase insert failed:", error);
      return res.status(500).json({ error: "Failed to save survey", details: error });
    }

    console.log("✅ Survey saved for:", user_email);
    return res.json({
      success: true,
      message: "Survey submitted successfully.",
      data: {
        email: user_email,
        variant,
        prediction,
      },
    });
  } catch (err) {
    console.error("❌ Survey Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export default loanTrustSurvey;
