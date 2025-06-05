import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/api/auth/me");
      console.log("Check auth response: ", res.data);
      set({ authUser: res.data.user });
    } catch (error) {
      console.log("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/api/auth/register", data);
      console.log("Signup response: ", res.data);
      toast.success("Signed up successfully!");
      set({ authUser: res.data.user });
    } catch (error) {
      console.log("Error signing up:", error);
      toast.error("Error signing up!");
      set({ authUser: null });
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/api/auth/login", data);
      console.log("Sign in response: ", res.data);

      toast.success("Logged In sucessfully!");
      set({ authUser: res.data.user });
    } catch (error) {
      console.log("Error signing in:", error);
      toast.error("Error Logging in!");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/api/auth/logout");
      console.log("Logging out response: ", res.data);
      toast.success("Logged out successfully!");
      set({ authUser: null });
    } catch (error) {
      console.log("Error Logging out:", error);
      toast.error("Error Logging out!");
    }
  },
}));
