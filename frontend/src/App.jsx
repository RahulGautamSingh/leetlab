import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout";
import AddProblem from "./pages/AddProblem";
import AdminRoute from "./components/AdminRoute";
import ProblemPage from "./pages/ProblemPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    const currentTheme = localStorage.getItem("theme") ?? "light";
    document.querySelector("html").setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col items-center justify-start">
        <Toaster />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />

            <Route
              path="/problem/:id"
              element={!authUser ? <SignupPage /> : <ProblemPage />}
            />
            <Route
              path="/profile"
              element={!authUser ? <SignupPage /> : <ProfilePage />}
            />

            <Route element={<AdminRoute />}>
              <Route
                path="/add-problem"
                element={authUser ? <AddProblem /> : <Navigate to="/" />}
              />
            </Route>
          </Route>
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </>
  );
}
