import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,

  executeCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    set({ isExecuting: true });
    try {
      const res = await axiosInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });

      set({ submission: res.data.submission });
      toast.success(res.data.message);
    } catch (error) {
      console.log(error, "Error executing the code");
      toast.error("Error executing the code");
    } finally {
      set({ isExecuting: false });
    }
  },
}));
