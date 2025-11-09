import express from "express";
import morgan from "morgan";
import cors from "cors";

// import trustAIRoutes from "./routes/trustAIRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";

import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

/// Create an instance of Express
const app = express();

// 1). MIDDLEWARE
// if (process.env.NODE_ENV === "development") {
//   const morgan = (await import("morgan")).default;
//   app.use(morgan("dev"));
// }

// ✅ Morgan logging in all environments
const format = process.env.NODE_ENV === "development" ? "dev" : "combined"; // or 'tiny' if you want less verbosity
app.use(morgan(format));
console.log(`🧾 Morgan logging enabled (${format})`);

// Your routes
app.get("/", (req, res) => {
  res.json({ message: "TrustAI backend is running!" });
});

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/// 2). ROUTES
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/loan", loanRoutes);
app.use("/api/v1/faq", faqRoutes);

// app.use((req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

/// 3). ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandler);

export default app;
