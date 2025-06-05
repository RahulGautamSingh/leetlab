import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import problemRoutes from "./routes/problem.route.js";
import executionRoutes from "./routes/execution.route.js";
import submissionRoutes from "./routes/submission.route.js";
import playlistRoutes from "./routes/playlist.route.js";

dotenv.config();
console.log("Allowed origin:", process.env.FRONTEND_URL);
console.log("PORT:", process.env.PORT);
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/problem", problemRoutes);
app.use("/api/execute-code", executionRoutes);
app.use("/api/submission", submissionRoutes);
app.use("/api/playlist", playlistRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port=>", process.env.PORT);
});
