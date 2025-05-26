import { db } from "../libs/db.js";

export const getAllSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await db.submission.findMany({ where: { userId } });

    res.status(200).json({
      message: "Fetched all submissions successfully",
      success: true,
      submissions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while fetching submissions",
    });
  }
};
export const getSubmissionForProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId } = req.params;

    const submissions = await db.submission.findMany({
      where: { userId, problemId },
    });

    res.status(200).json({
      message: "Fetched all submissions successfully",
      success: true,
      submissions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while fetching submission",
    });
  }
};

export const getAllSubmissionsForProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    const submissionCount = await db.submission.count({
      where: { problemId },
    });

    res.status(200).json({
      message: "Fetched all submissions successfully",
      success: true,
      count: submissionCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while fetching submission",
    });
  }
};
