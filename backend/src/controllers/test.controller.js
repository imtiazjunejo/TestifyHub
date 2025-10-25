import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Test from "../models/test.model.js";
import Question from "../models/question.model.js";

// Create a new test
export const createTest = asyncHandler(async (req, res) => {
  const { title, subject, duration, questions } = req.body;

  if (!title || !subject || !duration) {
    throw new ApiError(400, "Title, subject, and duration are required");
  }

  const test = await Test.create({
    title,
    subject,
    duration,
    createdBy: req.user._id,
    questions: [],
  });

  // Create questions if provided
  if (questions && questions.length > 0) {
    const questionDocs = await Question.insertMany(
      questions.map(q => ({
        ...q,
        testId: test._id,
      }))
    );
    test.questions = questionDocs.map(q => q._id);
    test.totalMarks = questionDocs.reduce((sum, q) => sum + q.marks, 0);
    await test.save();
  }

  const populatedTest = await Test.findById(test._id).populate('questions');

  return res.status(201).json(
    new ApiResponse(201, populatedTest, "Test created successfully")
  );
});

// Get all tests (for educators: their own tests, for students: all active tests)
export const getTests = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === 'Educator') {
    query.createdBy = req.user._id;
  } else if (req.user.role === 'Student') {
    query.isActive = true;
  }

  const tests = await Test.find(query)
    .populate('createdBy', 'name')
    .populate('questions')
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, tests, "Tests retrieved successfully")
  );
});

// Get a specific test by ID
export const getTestById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const test = await Test.findById(id)
    .populate('createdBy', 'name')
    .populate('questions');

  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  // Check permissions
  if (req.user.role === 'Student' && !test.isActive) {
    throw new ApiError(403, "Test is not available");
  }

  if (req.user.role === 'Educator' && test.createdBy._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  return res.status(200).json(
    new ApiResponse(200, test, "Test retrieved successfully")
  );
});

// Update a test
export const updateTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, subject, duration, isActive } = req.body;

  const test = await Test.findById(id);

  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  if (test.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  const updatedTest = await Test.findByIdAndUpdate(
    id,
    { title, subject, duration, isActive },
    { new: true }
  ).populate('questions');

  return res.status(200).json(
    new ApiResponse(200, updatedTest, "Test updated successfully")
  );
});

// Delete a test
export const deleteTest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const test = await Test.findById(id);

  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  if (test.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  await Question.deleteMany({ testId: id });
  await Test.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, {}, "Test deleted successfully")
  );
});