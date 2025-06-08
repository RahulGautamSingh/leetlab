import { ChevronRight, Home, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { startOfToday, subDays, formatDistance, format } from "date-fns";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import { useAuthStore } from "../store/useAuthStore";
import { useProblemStore } from "../store/useProblemStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { useExecutionStore } from "../store/useExecutionStore";
import ProblemProgressCard from "../components/ProblemProgressCard";

export default function ProfilePage() {
  const today = startOfToday();
  const startDate = subDays(today, 365);
  const daysToShow = 366;

  const heatmapData = Array.from({ length: daysToShow }, (_, i) => {
    const date = subDays(new Date(), daysToShow - 1 - i); // <-- reverse order
    return {
      date,
      count: 0,
    };
  });

  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { problems, solvedProblems, getAllProblems, getSolvedProblems } =
    useProblemStore();
  const [easyProblems, setEasyProblems] = useState(null);
  const [mediumProblems, setMediumProblems] = useState(null);
  const [hardProblems, setHardProblems] = useState(null);
  const { submissions, getAllSubmissions } = useSubmissionStore();
  const { setSubmission } = useExecutionStore();
  const [statefulHeatmapData, setStatefulHeatmapData] = useState(null);

  function updateStats() {
    const totalEasy = problems.filter((p) => p.difficulty === "EASY");
    const totalMedium = problems.filter((p) => p.difficulty === "MEDIUM");
    const totalHard = problems.filter((p) => p.difficulty === "HARD");
    const solvedEasy = solvedProblems.filter((p) => p.difficulty === "EASY");
    const solvedMedium = solvedProblems.filter(
      (p) => p.difficulty === "MEDIUM"
    );
    const solvedHard = solvedProblems.filter((p) => p.difficulty === "HARD");
    setEasyProblems(`${solvedEasy.length}/${totalEasy.length}`);
    setMediumProblems(`${solvedMedium.length}/${totalMedium.length}`);
    setHardProblems(`${solvedHard.length}/${totalHard.length}`);
  }

  function updateHeatmap() {
    const updated = heatmapData.map((day) => ({ ...day })); // shallow clone

    for (const submission of submissions) {
      const submittedOn = format(new Date(submission.createdAt), "MM/dd/yyyy");

      const heatMapBox = updated.find((day) => {
        const tday = format(new Date(day.date), "MM/dd/yyyy");
        return submittedOn === tday;
      });

      if (heatMapBox) heatMapBox.count++;
    }

    setStatefulHeatmapData(updated);
  }

  useEffect(() => {
    (async () => {
      await getAllProblems();
      await getSolvedProblems();
      updateStats();

      await getAllSubmissions();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (submissions.length > 0) {
      updateHeatmap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissions]);

  const getTooltipDataAttrs = (value) => {
    if (!value || !value.date) return null;

    return {
      "data-tooltip-id": "heatmap-tooltip",
      "data-tooltip-content": `${format(
        new Date(value.date),
        "MMM d, yyyy"
      )} — ${value.count} submission${value.count !== 1 ? "s" : ""}`,
    };
  };

  return (
    <div className="w-5/6 flex flex-col mx-auto mt-12 gap-6">
      {/* Grid layout */}
      <div className="grid grid-cols-3  grid-rows-2 gap-6">
        {/* Profile Info */}
        <div className="col-span-1 row-span-2 bg-base-200 rounded-xl p-6 flex flex-col gap-4 shadow items-start">
          <div className="flex gap-4">
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="w-20 h-20 rounded-b-box border-2 border-primary"
            />
            <div>
              <h2 className="text-xl font-semibold">{authUser.name}</h2>
              <h2 className="text-sm">@username</h2>
            </div>
          </div>

          <div className="divider"></div>

          <div>
            <div class="text-base font-medium leading-6">Community Stats</div>
            <div class="mt-4 flex flex-col space-y-4">
              <div class="flex flex-col space-y-1">
                <div class="flex items-center space-x-2 text-[14px]">
                  <div class="text-[18px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      class="text-blue-s dark:text-dark-blue-s"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M1.104 12.444a1 1 0 010-.888c.13-.26.37-.693.722-1.241A18.85 18.85 0 013.88 7.652C6.184 5.176 8.896 3.667 12 3.667s5.816 1.509 8.119 3.985c.79.85 1.475 1.756 2.055 2.663.352.548.593.98.722 1.24a1 1 0 010 .89c-.13.26-.37.692-.722 1.24a18.848 18.848 0 01-2.055 2.663c-2.303 2.476-5.015 3.985-8.119 3.985s-5.816-1.509-8.119-3.985a18.846 18.846 0 01-2.055-2.663c-.352-.548-.593-.98-.722-1.24zM12 16a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div class="text-label-2 dark:text-dark-label-2">Views</div>
                  <div>0</div>
                </div>
                <div class="ml-7 space-x-1 text-xs text-label-3 dark:text-dark-label-3">
                  <span>Last week</span>
                  <span>
                    <span class="text-label-4 dark:text-dark-label-4">0</span>
                  </span>
                </div>
              </div>
              <div class="flex flex-col space-y-1">
                <div class="flex items-center space-x-2 text-[14px]">
                  <div class="text-[18px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      class="text-teal dark:text-dark-teal"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2.442 3.433C2 4.152 2 5.136 2 7.1v9.8c0 1.964 0 2.946.442 3.668a3 3 0 00.99.99C4.155 22 5.136 22 7.1 22h9.8c1.964 0 2.946 0 3.668-.442.403-.247.743-.587.99-.99C22 19.845 22 18.863 22 16.9V7.1c0-1.964 0-2.946-.442-3.667a3 3 0 00-.99-.99C19.845 2 18.863 2 16.9 2H7.1c-1.964 0-2.946 0-3.667.442a3 3 0 00-.99.99zm6.534 7.823l1.805 1.805 4.243-4.243a1 1 0 011.414 1.414l-4.95 4.95a1 1 0 01-1.414 0L7.562 12.67a1 1 0 111.414-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div class="text-label-2 dark:text-dark-label-2">
                    Solution
                  </div>
                  <div>0</div>
                </div>
                <div class="ml-7 space-x-1 text-xs text-label-3 dark:text-dark-label-3">
                  <span>Last week</span>
                  <span>
                    <span class="text-blue-s dark:text-dark-blue-s">+1</span>
                  </span>
                </div>
              </div>
              <div class="flex flex-col space-y-1">
                <div class="flex items-center space-x-2 text-[14px]">
                  <div class="text-[18px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 18 18"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      class="text-olive dark:text-dark-olive"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 12.553A3.746 3.746 0 0112.531 9l.22-.001a3.75 3.75 0 013.412 5.304l.33 1.727a.395.395 0 01-.462.462l-1.727-.331A3.75 3.75 0 019 12.749v-.197z"
                        clip-rule="evenodd"
                      ></path>
                      <path d="M1.5 8.251a6.75 6.75 0 013.73-6.036A6.657 6.657 0 018.249 1.5h.401a.75.75 0 01.042.001c2.95.164 5.403 2.265 6.112 5.065.101.402 0 .895-.543.911-.543.016-1.51.023-1.51.023a5.25 5.25 0 00-5.25 5.25s-.048 1.248-.024 1.5c.024.25-.513.64-.914.537a6.653 6.653 0 01-1.33-.502.05.05 0 00-.032-.004l-2.601.498a.75.75 0 01-.878-.877l.498-2.603a.05.05 0 00-.004-.032A6.655 6.655 0 011.5 8.251z"></path>
                    </svg>
                  </div>
                  <div class="text-label-2 dark:text-dark-label-2">Discuss</div>
                  <div>0</div>
                </div>
                <div class="ml-7 space-x-1 text-xs text-label-3 dark:text-dark-label-3">
                  <span>Last week</span>
                  <span>
                    <span class="text-label-4 dark:text-dark-label-4">0</span>
                  </span>
                </div>
              </div>
              <div class="flex flex-col space-y-1">
                <div class="flex items-center space-x-2 text-[14px]">
                  <div class="text-[18px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      class="text-brand-orange dark:text-dark-brand-orange"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M11.394 2.074a2.5 2.5 0 011.212 0c.723.181 1.185.735 1.526 1.262.342.528.703 1.259 1.131 2.127l.392.795c.302.61.348.667.386.7a.498.498 0 00.086.063c.043.025.11.052.786.15l.877.128c.958.139 1.764.256 2.372.418.606.162 1.276.43 1.671 1.062a2.5 2.5 0 01.375 1.152c.052.744-.333 1.354-.728 1.841-.397.489-.98 1.058-1.674 1.733l-.634.619c-.489.476-.527.537-.548.583a.5.5 0 00-.033.101c-.01.05-.015.122.1.794l.15.873c.164.954.302 1.758.335 2.386.034.627-.014 1.346-.493 1.918-.263.314-.6.558-.98.712-.692.279-1.39.102-1.976-.124-.588-.226-1.309-.605-2.165-1.056l-.785-.412c-.603-.317-.674-.335-.724-.34a.497.497 0 00-.106 0c-.05.005-.12.023-.724.34l-.785.412c-.856.45-1.577.83-2.165 1.056-.585.226-1.284.403-1.976.124a2.5 2.5 0 01-.98-.712c-.48-.572-.527-1.291-.493-1.918.033-.628.171-1.431.335-2.386l.15-.873c.115-.672.11-.745.1-.794a.5.5 0 00-.033-.101c-.02-.046-.06-.107-.548-.583l-.634-.619c-.694-.675-1.277-1.244-1.674-1.733-.395-.487-.78-1.097-.728-1.841a2.5 2.5 0 01.375-1.152c.395-.633 1.065-.9 1.67-1.062.61-.162 1.415-.28 2.373-.418l.877-.128c.675-.098.743-.125.786-.15a.5.5 0 00.086-.062c.038-.034.084-.09.386-.701l.392-.795c.428-.868.789-1.599 1.131-2.127.341-.527.803-1.08 1.526-1.262z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div class="text-label-2 dark:text-dark-label-2">
                    Reputation
                  </div>
                  <div>0</div>
                </div>
                <div class="ml-7 space-x-1 text-xs text-label-3 dark:text-dark-label-3">
                  <span>Last week</span>
                  <span>
                    <span class="text-label-4 dark:text-dark-label-4">0</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="col-span-1 bg-base-200 rounded-xl p-6 shadow grid grid-cols-3 text-center">
          <div className="flex justify-between items-center gap-8">
            <div className="flex flex-col items-center justify-center">
              <ProblemProgressCard
                solved={solvedProblems.length}
                total={problems.length}
              />
            </div>
            <div className="flex flex-col ml-6 gap-2">
              <div className="flex flex-col items-center justify-center py-1 px-2 rounded-md bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.06)]">
                <h3 className="text-xl font-bold link-accent">Easy</h3>
                <p className="text-sm text-gray-400 font-medium">
                  {easyProblems}{" "}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center py-1 px-2 rounded-md bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.06)]">
                <h3 className="text-xl font-bold text-orange-400">Medium</h3>
                <p className="text-sm text-gray-400 font-medium">
                  {mediumProblems}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center py-1 px-2 rounded-md bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.06)]">
                <h3 className="text-xl font-bold text-red-400">Hard</h3>
                <p className="text-sm text-gray-400 font-medium">
                  {" "}
                  {hardProblems}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 bg-base-200 rounded-xl p-6 shadow grid grid-cols-3 text-center">
          <div class="p-4">
            <div>
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-base font-medium leading-6">Badges</div>
                  <div class="text-label-1 dark:text-dark-label-1 mt-1.5 text-2xl leading-[18px]">
                    0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty 1/3 + Heatmap 2/3 */}
        <div className="col-span-2 bg-base-200 rounded-xl p-6 shadow">
          <h3 className="font-semibold mb-4">Submission Activity</h3>
          {!statefulHeatmapData ? (
            <div className="h-[140px] w-full bg-base-300 animate-pulse rounded-md" />
          ) : (
            <CalendarHeatmap
              startDate={startDate}
              endDate={new Date()}
              values={statefulHeatmapData}
              showMonthLabels={true}
              classForValue={(value) => {
                if (!value || value.count === 0) return "color-empty";
                if (value.count === 1) return "color-scale-1";
                if (value.count === 2) return "color-scale-2";
                return "color-scale-3";
              }}
              tooltipDataAttrs={getTooltipDataAttrs}
            />
          )}
          <style>
            {`
                .color-empty {
                  fill: #ebedf0;
                }
                .color-scale-1 {
                  fill: #c6e48b;
                }
                .color-scale-2 {
                  fill: #7bc96f;
                }
                .color-scale-3 {
                  fill: #196127;
                }

                .react-calendar-heatmap .month-label {
                  font-size: 12px;
                  fill: #999;
                }
              `}
          </style>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-base-200 rounded-xl p-6 shadow">
        <div className="flex justify-between">
          <h3 className="font-semibold text-lg mb-4">Recent Submissions</h3>
          <h3 className="font-semibold text-lg mb-4">
            <Link to="/submissions" className="link-primary">
              {"All Submissions >"}{" "}
            </Link>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Status</th>
                <th>Language</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length !== 0 &&
                submissions
                  .slice(-7)
                  .reverse()
                  .map((submission) => {
                    return (
                      <tr key={submission.id}>
                        <td
                          onClick={() => {
                            setSubmission(submission);
                            navigate(`/problem/${submission.problem.id}`);
                          }}
                          className="link-accent"
                        >
                          {submission.problem.title}
                        </td>
                        <td
                          className={
                            submission.status[0] === "A"
                              ? "text-green-400 font-semibold"
                              : "text-red-400 font-semibold"
                          }
                        >
                          {submission.status}
                        </td>
                        <td>{submission.language}</td>
                        <td>
                          {formatDistance(
                            new Date(submission.createdAt),
                            new Date()
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
      <ReactTooltip
        id="heatmap-tooltip"
        place="top"
        effect="solid"
        className="z-50 text-xs"
        delayShow={100}
      />
    </div>
  );
}
