import React from "react";
import CreateProblemForm from "../components/CreateProblemForm";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function AddProblem() {
  return (
    <div>
      <CreateProblemForm />
    </div>
  );
}
