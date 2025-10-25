import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useTestStore = create((set, get) => ({
  tests: [],
  currentTest: null,
  questions: [],
  results: [],
  isLoading: false,

  // Fetch all tests
  fetchTests: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/tests");
      set({ tests: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch tests");
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new test
  createTest: async (testData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/tests", testData);
      set((state) => ({ tests: [...state.tests, res.data.data] }));
      toast.success("Test created successfully");
      return res.data.data;
    } catch (error) {
      toast.error("Failed to create test");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Get test by ID
  getTestById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/tests/${id}`);
      set({ currentTest: res.data.data });
      return res.data.data;
    } catch (error) {
      toast.error("Failed to fetch test");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update test
  updateTest: async (id, testData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.put(`/tests/${id}`, testData);
      set((state) => ({
        tests: state.tests.map(test => test._id === id ? res.data.data : test),
        currentTest: res.data.data
      }));
      toast.success("Test updated successfully");
    } catch (error) {
      toast.error("Failed to update test");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete test
  deleteTest: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/tests/${id}`);
      set((state) => ({
        tests: state.tests.filter(test => test._id !== id)
      }));
      toast.success("Test deleted successfully");
    } catch (error) {
      toast.error("Failed to delete test");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch questions for a test
  fetchQuestions: async (testId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/questions/${testId}`);
      set({ questions: res.data.data });
      return res.data.data;
    } catch (error) {
      toast.error("Failed to fetch questions");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Add question to test
  addQuestion: async (questionData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/questions", questionData);
      set((state) => ({ questions: [...state.questions, res.data.data] }));
      toast.success("Question added successfully");
      return res.data.data;
    } catch (error) {
      toast.error("Failed to add question");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update question
  updateQuestion: async (id, questionData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.put(`/questions/${id}`, questionData);
      set((state) => ({
        questions: state.questions.map(q => q._id === id ? res.data.data : q)
      }));
      toast.success("Question updated successfully");
    } catch (error) {
      toast.error("Failed to update question");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete question
  deleteQuestion: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/questions/${id}`);
      set((state) => ({
        questions: state.questions.filter(q => q._id !== id)
      }));
      toast.success("Question deleted successfully");
    } catch (error) {
      toast.error("Failed to delete question");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Submit test answers
  submitTest: async (testId, answers, timeTaken) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/results/submit", {
        testId,
        answers,
        timeTaken
      });
      toast.success("Test submitted successfully");
      return res.data.data;
    } catch (error) {
      toast.error("Failed to submit test");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch user results
  fetchUserResults: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/results/user");
      set({ results: res.data.data });
      return res.data.data;
    } catch (error) {
      toast.error("Failed to fetch results");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch test results (for educators)
  fetchTestResults: async (testId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/results/test/${testId}`);
      return res.data.data;
    } catch (error) {
      toast.error("Failed to fetch test results");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Get analytics
  getAnalytics: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/results/analytics");
      return res.data.data;
    } catch (error) {
      toast.error("Failed to fetch analytics");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));