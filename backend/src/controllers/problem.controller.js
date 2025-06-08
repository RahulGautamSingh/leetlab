import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import {
  getJudge0LangugeId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

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

    if (req.user.role !== "ADMIN") {
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

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log(result);
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

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    if (!problems) {
      return res.status(404).json({
        error: "No problems found",
      });
    }

    res.status(200).json({
      message: "Problems fetched successfully",
      success: true,
      problems,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while getting all problems",
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problemId = req.params.id;

    const problem = await db.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    res.status(200).json({
      message: "Problem fetched successfully",
      success: true,
      problem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `Error while getting problem with ID: ${id}`,
    });
  }
};

export const updateProblem = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    const problemId = req.params.id;
    const problem = await db.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

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

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log(result);
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }

      const updatedProblem = await db.problem.update({
        where: { id: problemId },
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
        message: "Problem updated",
        success: true,
        problem: updatedProblem,
      });
    }
  } catch (error) {
    console.error(error, "Error while updating problem");
    res.status(500).json({ error: "Error while updating problem" });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    const problemId = req.params.id;

    const problem = await db.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    await db.problem.delete({ where: { id: problemId } });
    res.status(200).json({
      message: "Problem deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `Error while deleting problem with ID: ${id}`,
    });
  }
};

export const getSolvedProblems = async (req, res) => {
  try {
    const userId = req.user.id;
    const problems =
      (await db.problem.findMany({
        where: {
          solvedBy: {
            some: {
              userId,
            },
          },
        },
        include: {
          solvedBy: true,
        },
      })) || [];

    res.status(200).json({
      messaage: "Fetched solved problems succesfully",
      success: true,
      problems,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while fetching solved problem",
    });
  }
};
