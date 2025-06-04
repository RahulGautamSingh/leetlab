import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useActionStore = create((set) => ({
  isDeletingProblem: false,

  deleteProblem: async (id) => {
    set({ isDeletingProblem: true });
    try {
      const res = await axiosInstance.delete(
        `/api/problem/delete-problem/${id}`
      );
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error deleting problem", error);
      toast.error("Error deleting problem");
    } finally {
      set({ isDeletingProblem: false });
    }
  },
}));
