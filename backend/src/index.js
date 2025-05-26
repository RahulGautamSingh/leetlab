import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import problemRoutes from "./routes/problem.route.js";
import executionRoutes from "./routes/execution.route.js";
import submissionRoutes from "./routes/submission.route.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/problem", problemRoutes);
app.use("/api/execute-code", executionRoutes);
app.use("/api/submission", submissionRoutes);

app.listen(8000, () => {
  console.log("Server running on port=>8000");
});
