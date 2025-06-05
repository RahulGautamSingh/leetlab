import React from "react";
import CreateProblemForm from "../components/CreateProblemForm";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function AddProblem() {
  return (
    <div>
      <nav className="navbar bg-base-100 shadow-lg px-4 sticky top-0 z-10">
        <div className="flex-1 gap-2">
          <Link to={"/"} className="flex items-center gap-2 text-primary">
            <Home className="w-6 h-6" />
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>
      <CreateProblemForm />
    </div>
  );
}
