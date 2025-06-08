import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useSubmissionStore = create((set) => ({
  /** All submissions for user */
  submissions: [],
  /** Count of all submissions for problem from all users  */
  submissionCount: null,
  /** All submissions for problem by current user */
  submission: null,
  isLoading: false,

  getSubmissionForProblem: async (id) => {
    try {
      const res = await axiosInstance.get(
        `/api/submission/get-submissions/${id}`
      );
      console.log("submissions", res.data.submissions);
      set({ submission: res.data.submissions });
    } catch (error) {
      toast.error("Error getting submissions for this problem");
      console.error(error, "Error getting submissions for this problem");
    }
  },

  getSubmissionCountForProblem: async (id) => {
    try {
      const res = await axiosInstance.get(
        `/api/submission/get-submissions-count/${id}`
      );
      set({ submissionCount: res.data.count });
    } catch (error) {
      toast.error("Error getting submissions count for this problem");
      console.error(error, "Error getting submissions count for this problem");
    }
  },

  getAllSubmissions: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/api/submission/get-all-submissions`
      );
      console.log(res.data);
      set({ submissions: res.data.submissions });
    } catch (error) {
      toast.error("Error getting submissions for user");
      console.error(error, "Error getting submissions user");
    } finally {
      set({ isLoading: false });
    }
  },
}));
