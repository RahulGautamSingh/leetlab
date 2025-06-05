import { ChevronRight, Home } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays } from "date-fns";

export default function ProfilePage() {
  // Sample heatmap data (should come from backend)
  const today = new Date();
  const heatmapData = Array.from({ length: 120 }, (_, i) => ({
    date: subDays(today, i).toISOString().split("T")[0],
    count: Math.floor(Math.random() * 3),
  }));

  return (
    <>
      <nav className="navbar bg-base-100 shadow-lg px-4 sticky top-0 z-10 w-4/6">
        <div className="flex-1 gap-2">
          <Link to={"/"} className="flex items-center gap-2 text-primary">
            <Home className="w-6 h-6" />
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <div className="flex flex-col w-5/6 mx-auto mt-12 gap-6">
        {/* Grid layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="col-span-1 bg-base-200 rounded-xl p-6 flex items-center gap-4 shadow">
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="w-20 h-20 rounded-full border-2 border-primary"
            />
            <div>
              <h2 className="text-xl font-semibold">Rahul Singh</h2>
              <p className="text-sm text-gray-400">@rahul_solvez</p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="col-span-2 bg-base-200 rounded-xl p-6 shadow grid grid-cols-3 text-center">
            <div>
              <h3 className="text-xl font-bold text-primary">143</h3>
              <p className="text-sm text-gray-400">Problems Solved</p>
            </div>
            <div>
              <h3 className="text-xl font-bold">250</h3>
              <p className="text-sm text-gray-400">Total Problems</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-500">#1201</h3>
              <p className="text-sm text-gray-400">Global Rank</p>
            </div>
          </div>

          {/* Empty 1/3 + Heatmap 2/3 */}
          <div className="col-span-1" />
          <div className="col-span-2 bg-base-200 rounded-xl p-6 shadow">
            <h3 className="font-semibold mb-4">Submission Activity</h3>
            <CalendarHeatmap
              startDate={subDays(today, 119)}
              endDate={today}
              values={heatmapData}
              classForValue={(value) => {
                if (!value || value.count === 0) return "color-empty";
                if (value.count === 1) return "color-scale-1";
                if (value.count === 2) return "color-scale-2";
                return "color-scale-3";
              }}
              gutterSize={3}
            />
            <style>
              {`
                .color-empty { fill: #2a2a2a; }
                .color-scale-1 { fill: #3b82f6; }
                .color-scale-2 { fill: #2563eb; }
                .color-scale-3 { fill: #1d4ed8; }
              `}
            </style>
          </div>
        </div>

        {/* Recent Submissions Table */}
        <div className="bg-base-200 rounded-xl p-6 shadow">
          <h3 className="font-semibold text-lg mb-4">Recent Submissions</h3>
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
                <tr>
                  <td>Two Sum</td>
                  <td className="text-green-400">Accepted</td>
                  <td>JavaScript</td>
                  <td>2 hours ago</td>
                </tr>
                <tr>
                  <td>Valid Parentheses</td>
                  <td className="text-red-400">Wrong Answer</td>
                  <td>Python</td>
                  <td>4 hours ago</td>
                </tr>
                <tr>
                  <td>Climbing Stairs</td>
                  <td className="text-green-400">Accepted</td>
                  <td>Java</td>
                  <td>1 day ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
