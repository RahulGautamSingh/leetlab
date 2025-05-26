import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import { getJudge0LangugeId, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
    } = req.body;

    if (req.user.id !== "ADMIN") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LangugeId(language);
      if (!languageId) {
        return res.status(400).json({
          error: `Language ${language} not supported`,
        });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (const i = 0; i < results.length; i++) {
        const result = result[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }

      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });

      return res.status(201).json({
        message: "Problem created",
        success: true,
        problem: newProblem,
      });
    }
  } catch (error) {
    console.error(error, "Error while creating problem");
    res.status(500).json({ error: "Error while creating problem" });
  }
};

export const getAllProblems = async (req, res) => {};

export const getProblemById = async (req, res) => {};

export const updateProblem = async (req, res) => {};

export const deleteProblem = async (req, res) => {};

export const getSolvedProblems = async (req, res) => {};
