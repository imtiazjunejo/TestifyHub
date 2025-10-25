import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import path from "path";
import { fileURLToPath } from "url";

export const app = express();

// ✅ Enable CORS for frontend (Vite default: 5173)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Core middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ✅ Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Static folders
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/temp", express.static(path.join(__dirname, "../temp"))); // for temp images
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../public"))); // fallback

// ✅ Routes
import authRouter from "./routes/auth.routes.js";
import testRouter from "./routes/test.routes.js";
import questionRouter from "./routes/question.routes.js";
import resultRouter from "./routes/result.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/tests", testRouter);
app.use("/api/questions", questionRouter);
app.use("/api/results", resultRouter);

// ✅ Global error handler
app.use(errorHandler);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 TestifyHub API is running successfully...");
});
