import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_KEY
// );

// --- Proxy to FastAPI backend ---
const loanApproval = async (req, res) => {
  //   try {
  //     const mode = req.query.variant || "xai";
  //     const backendUrl = `${process.env.PYTHON_BACKEND_URL}/loan_form_test?variant=${mode}`;
  //     const response = await fetch(backendUrl, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(req.body),
  //     });
  //     const result = await response.json();
  //     res.json(result);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: "Backend connection failed" });
  //   }
  res.status(200).json({ mode: "working" });
};

export default loanApproval;
