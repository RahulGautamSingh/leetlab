import React from "react";

export default function ProblemProgressCard({ solved = 0, total = 3575 }) {
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const solvedPercent = (solved / total) * 100;

  const strokeDashoffset =
    circumference - (solvedPercent / 100) * circumference;

  return (
    <div className="bg-base-200 p-6 rounded-xl w-64 h-44 flex flex-col items-center justify-center shadow relative">
      <svg
        width="150"
        height="75"
        viewBox="0 0 150 75"
        className="absolute top-4"
      >
        {/* Base ring */}
        <path
          d="
            M 20 75
            A 55 55 0 0 1 130 75
          "
          stroke="#444"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Solved portion */}
        <path
          d="
            M 20 75
            A 55 55 0 0 1 130 75
          "
          stroke="#10b981"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="mt-10 text-center z-10">
        <h2 className="text-2xl font-bold text-white">
          {solved}/{total}
        </h2>
        <p className="text-sm text-gray-400">Solved</p>
      </div>
    </div>
  );
}
