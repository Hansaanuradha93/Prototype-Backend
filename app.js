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
const format = process.env.NODE_ENV === "development" ? "dev" : "combined"; // or 'tiny' if you want less verbosity
app.use(morgan(format));

// Your routes
app.get("/", (req, res) => {
  res.json({ message: "TrustAI backend is running!" });
});

/// 2️⃣ CORS CONFIGURATION (LOCAL + PRODUCTION)
/// --------------------------------------------------
const allowedOrigins = [
  "http://localhost:3000", // Local frontend
  "https://xai-chatbot.vercel.app", // Production frontend
];

app.use(
  cors({
    origin(origin, callback) {
      /// Allow requests with no origin (e.g., Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked for origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/// 2). ROUTES
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/loan", loanRoutes);
app.use("/api/v1/faq", faqRoutes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/// 3). ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandler);

export default app;
