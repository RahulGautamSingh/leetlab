import express from "express";
import {
  getAllSubmissions,
  getSubmissionsCountForProblem,
  getSubmissionForProblem,
} from "../controllers/submission.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);
submissionRoutes.get(
  "/get-submissions/:problemId",
  authMiddleware,
  getSubmissionForProblem
);
submissionRoutes.get(
  "/get-submissions-count/:problemId",
  authMiddleware,
  getSubmissionsCountForProblem
);

export default submissionRoutes;
