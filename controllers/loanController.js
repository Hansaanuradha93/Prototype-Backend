import fetch from "node-fetch";

/// Loan Form Test (Proxy to Python Service)
const loanApproval = async (req, res) => {
  try {
    /// Extract mode variant (xai | baseline)
    const mode = req.query.variant || "xai";

    console.log("⚡️ Node mode: ", mode);

    /// Build Python backend URL
    const backendUrl = `${process.env.PYTHON_BACKEND_URL}/loan_form_test?variant=${mode}`;
    console.log(`🔁 Forwarding loan request → ${backendUrl}`);

    /// Forward request body to Python FastAPI
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    /// Parse backend response
    const data = await response.json();

    /// Handle Python-side errors gracefully
    if (!response.ok) {
      console.error("⚠️ Python backend returned error:", data);
      return res.status(response.status).json({
        error: "Python service error",
        details: data,
      });
    }

    /// Log success and return same payload
    console.log("✅ Loan prediction received:", data.prediction);
    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ LoanFormTest Error:", err.message);
    return res.status(500).json({
      error: "Failed to connect to Python backend",
      details: err.message,
    });
  }
};

export default loanApproval;
