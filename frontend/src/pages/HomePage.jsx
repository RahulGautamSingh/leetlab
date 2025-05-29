import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center mt-14 px-4">
      <div className="absolute top-16 left-0 w-1/3 h-1/3 bg-primary opacity-30 blur-3xl rounded-md bottom-9"></div>

      <h1 className="text-4xl font-extrabold z-10 text-center">
        Welcome to <span className="text-primary">Leetlab</span>{" "}
      </h1>
    </div>
  );
}
