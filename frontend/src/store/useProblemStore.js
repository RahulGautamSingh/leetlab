import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    set({ isProblemsLoading: true });
    try {
      const res = await axiosInstance.get("/problem/get-all-problems");
      set({ problems: res.data.problems });
    } catch (error) {
      console.error("Error while fetching problems: ", error);
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getSolvedProblems: async () => {
    try {
      const res = await axiosInstance.get("/problem/get-solved-problems");
      set({ solvedProblems: res.data.problems });
    } catch (error) {
      console.error("Error while fetching solved problems: ", error);
    }
  },

  getProblemById: async (id) => {
    set({ isProblemLoading: true });
    try {
      const res = await axiosInstance.get(`/problem/get-problem/${id}`);
      set({ problem: res.data.problem });
    } catch (error) {
      console.error("Error while fetching problems " + id, error);
    } finally {
      set({ isProblemLoading: false });
    }
  },

  deleteProblem: async () => {
    // TODO: Implement
  },
}));
