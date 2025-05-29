import axios from "axios";

export const getJudge0LangugeId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
  };

  return languageMap[language.toUpperCase()];
};

export const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: `${process.env.JUDGE0_API_URL}/submissions/batch`,
    params: {
      base64_encoded: false,
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_API_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };
  const { data } = await axios.request(options);

  console.log("Submissions Results: ", data);

  return data;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens) => {
  const options = {
    method: "GET",
    url: `${process.env.JUDGE0_API_URL}/submissions/batch`,
    params: {
      tokens: tokens.join(","),
      base64_encoded: false,
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_API_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  while (true) {
    const { data } = await axios.request(options);

    const results = data.submissions;

    const isAllDone = results.every(
      (submission) => submission.status.id !== 1 && submission.status.id !== 2
    );

    if (isAllDone) {
      return results;
    }

    await sleep(2000);
  }
};

export const getLanguageName = (language_id) => {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };

  return LANGUAGE_NAMES[language_id] || "Unknown";
};
