import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({
        error: "Unauthenticated User",
      });
    }

    // validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({
        error: "Invalid or missing test cases",
      });
    }

    // prepare each test case for judge0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // send this batch of submissions to judge0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // poll judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    console.log("Result----------");
    console.log(results);

    res.status(200).json({
      message: "Code executed successfully",
      success: true,
      results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while executing code",
    });
  }
};
