import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Result from "../models/result.model.js";
import Test from "../models/test.model.js";
import Question from "../models/question.model.js";

// Submit test answers and calculate results
export const submitTest = asyncHandler(async (req, res) => {
  const { testId, answers, timeTaken } = req.body;

  if (!testId || !answers) {
    throw new ApiError(400, "Test ID and answers are required");
  }

  const test = await Test.findById(testId).populate('questions');
  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  if (!test.isActive) {
    throw new ApiError(403, "Test is not available");
  }

  // Check if user already submitted this test
  const existingResult = await Result.findOne({ userId: req.user._id, testId });
  if (existingResult) {
    throw new ApiError(400, "Test already submitted");
  }

  let score = 0;
  const processedAnswers = [];

  for (const answer of answers) {
    const question = test.questions.find(q => q._id.toString() === answer.questionId);
    if (question) {
      const isCorrect = question.correctAnswer.toLowerCase() === answer.answer.toLowerCase();
      if (isCorrect) {
        score += question.marks;
      }
      processedAnswers.push({
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect,
      });
    }
  }

  const percentage = (score / test.totalMarks) * 100;

  const result = await Result.create({
    userId: req.user._id,
    testId,
    answers: processedAnswers,
    score,
    totalMarks: test.totalMarks,
    percentage,
    timeTaken: timeTaken || 0,
    status: 'Completed',
  });

  const populatedResult = await Result.findById(result._id)
    .populate('userId', 'name email')
    .populate('testId', 'title subject');

  return res.status(201).json(
    new ApiResponse(201, populatedResult, "Test submitted successfully")
  );
});

// Get user's test results
export const getUserResults = asyncHandler(async (req, res) => {
  const results = await Result.find({ userId: req.user._id })
    .populate('testId', 'title subject duration totalMarks')
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, results, "Results retrieved successfully")
  );
});

// Get all results for a specific test (for educators)
export const getTestResults = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  const test = await Test.findById(testId);
  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  if (test.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  const results = await Result.find({ testId })
    .populate('userId', 'name email')
    .sort({ score: -1 });

  return res.status(200).json(
    new ApiResponse(200, results, "Test results retrieved successfully")
  );
});

// Get a specific result
export const getResult = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await Result.findById(id)
    .populate('userId', 'name email')
    .populate('testId', 'title subject')
    .populate('answers.questionId', 'questionText type marks');

  if (!result) {
    throw new ApiError(404, "Result not found");
  }

  // Check permissions
  if (result.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin') {
    // For educators, check if they created the test
    const test = await Test.findById(result.testId._id);
    if (test.createdBy.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Access denied");
    }
  }

  return res.status(200).json(
    new ApiResponse(200, result, "Result retrieved successfully")
  );
});

// Get analytics for the authenticated user
export const getAnalytics = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    const userId = req.user._id;

    // Fetch user's test results
    const results = await Result.find({ userId })
      .populate('testId', 'title subject')
      .sort({ createdAt: -1 });

    if (!results || results.length === 0) {
      // Return fallback data if no results found
      const fallbackData = {
        totalTests: 0,
        passedTests: 0,
        averageScore: 0,
        recentActivity: []
      };
      return res.status(200).json(
        new ApiResponse(200, { success: true, data: fallbackData }, "No analytics data available")
      );
    }

    // Calculate analytics
    const totalTests = results.length;
    const passedTests = results.filter(result => result.percentage >= 50).length; // Assuming 50% pass threshold
    const averageScore = results.reduce((sum, result) => sum + result.percentage, 0) / totalTests;
    const recentActivity = results.slice(0, 5).map(result => ({
      testTitle: result.testId.title,
      score: result.score,
      percentage: result.percentage,
      date: result.createdAt
    }));

    const analyticsData = {
      totalTests,
      passedTests,
      averageScore: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
      recentActivity
    };

    return res.status(200).json(
      new ApiResponse(200, { success: true, data: analyticsData }, "Analytics retrieved successfully")
    );
  } catch (error) {
    console.error("Error fetching analytics:", error);

    // Fallback dummy data on error
    const fallbackData = {
      totalTests: 0,
      passedTests: 0,
      averageScore: 0,
      recentActivity: []
    };

    return res.status(200).json(
      new ApiResponse(200, { success: true, data: fallbackData }, "Analytics retrieved with fallback data due to error")
    );
  }
});