import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Clock,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  Loader2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/utils";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionsList";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [testCases, setTestCases] = useState([]);
  const { executeCode, submission, isExecuting, setSubmission } =
    useExecutionStore();
  const [selectedLanguage, setSelectedLanguage] = useState(
    submission?.language?.toUpperCase() ?? "JAVA"
  );

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        submission?.sourceCode || problem.codeSnippets?.[selectedLanguage] || ""
      );
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    setSubmission({ ...submission, sourceCode: undefined });
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200 w-full">
        <div className="card bg-base-100 p-8 shadow-xl flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl mb-6">
                  {problem.constraints.split("\n").map((constraint) => (
                    <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                      {constraint}
                    </span>
                  ))}
                </div>
              </>
            )}

            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples)
                  // .filter((p) => p.language === selectedLanguage)
                  .map(([lang, example]) => {
                    console.log(lang, selectedLanguage);
                    return lang === selectedLanguage ? (
                      <div
                        key={lang}
                        className="bg-base-200 p-6 rounded-xl mb-6 font-mono"
                      >
                        <div className="mb-4">
                          <div className="text-indigo-300 mb-2 text-base font-semibold">
                            Input:
                          </div>
                          {example.input.split("\n").map((input) => (
                            <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                              {input}
                            </span>
                          ))}
                        </div>
                        <div className="mb-4">
                          <div className="text-indigo-300 mb-2 text-base font-semibold">
                            Output:
                          </div>
                          <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                            {example.output}
                          </span>
                        </div>
                        {example.explanation && (
                          <div>
                            <div className="text-emerald-300 mb-2 text-base font-semibold">
                              Explanation:
                            </div>
                            <p className="text-base-content/70 text-lg font-sem">
                              {example.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <></>
                    );
                  })}
              </>
            )}

            <div className="collapse bg-base-100 border border-base-300">
              <input type="radio" name="my-accordion-1" />
              <div className="collapse-title font-semibold">Topics</div>
              <div className="collapse-content text-sm"></div>
            </div>
            <div className="collapse bg-base-100 border border-base-300">
              <input type="radio" name="my-accordion-1" />
              <div className="collapse-title font-semibold">
                I forgot my password. What should I do?
              </div>
              <div className="collapse-content text-sm">
                Click on "Forgot Password" on the login page and follow the
                instructions sent to your email.
              </div>
            </div>
            <div className="collapse bg-base-100 border border-base-300">
              <input type="radio" name="my-accordion-1" />
              <div className="collapse-title font-semibold">
                How do I update my profile information?
              </div>
              <div className="collapse-content text-sm">
                Go to "My Account" settings and select "Edit Profile" to make
                changes.
              </div>
            </div>
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "discussion":
        return (
          <div className="p-4 text-center text-base-content/70">
            No discussions yet
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">
                No hints available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 w-full">
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1 gap-2">
          <div className="mt-2">
            <h1 className="text-xl font-bold">{problem.title}</h1>
            <div className="flex items-center gap-2 text-sm text-base-content/70 mt-5">
              <Clock className="w-4 h-4" />
              <span>
                Updated{" "}
                {new Date(problem.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-base-content/30">•</span>
              <Users className="w-4 h-4" />
              <span>
                {submissionCount}{" "}
                {submissionCount > 1 ? "Submissions" : "Submission"}
              </span>
              <span className="text-base-content/30">•</span>
              <ThumbsUp className="w-4 h-4" />
              <span>95% Success Rate</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            className="btn btn-success gap-2"
            onClick={handleRunCode}
            disabled={isExecuting}
          >
            {!isExecuting && <Play className="w-4 h-4" />}
            {!isExecuting && "Run Code"}
            {isExecuting && <Loader2 className="h-5 w-5 animate-spin" />}
          </button>

          <select
            className="select select-bordered select-primary w-40"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div className=" mx-auto p-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered">
                <button
                  className={`tab gap-2 ${
                    activeTab === "description" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  <FileText className="w-4 h-4" />
                  Description
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "submissions" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("submissions")}
                >
                  <Code2 className="w-4 h-4" />
                  Submissions
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "discussion" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("discussion")}
                >
                  <MessageSquare className="w-4 h-4" />
                  Discussion
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "hints" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("hints")}
                >
                  <Lightbulb className="w-4 h-4" />
                  Hints
                </button>
              </div>

              <div className="p-6">{renderTabContent()}</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered">
                <button className="tab tab-active gap-2">
                  <Terminal className="w-4 h-4" />
                  Code Editor
                </button>
              </div>

              <div className="h-[600px] w-full">
                <Editor
                  height="80%"
                  language={selectedLanguage.toLowerCase()}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                  }}
                />

                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    {submission ? (
                      <Submission submission={submission} />
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold">Test Cases</h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="table table-zebra w-full">
                            <thead>
                              <tr>
                                <th>Input</th>
                                <th>Expected Output</th>
                              </tr>
                            </thead>
                            <tbody>
                              {testCases.map((testCase, index) => (
                                <tr key={index}>
                                  <td className="font-mono">
                                    {testCase.input}
                                  </td>
                                  <td className="font-mono">
                                    {testCase.output}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
