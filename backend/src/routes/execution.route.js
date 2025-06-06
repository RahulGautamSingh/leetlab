import express from "express";
import { executeCode } from "../controllers/execution.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const executionRoutes = express.Router();

executionRoutes.post("/", authMiddleware, executeCode);

export default executionRoutes;
