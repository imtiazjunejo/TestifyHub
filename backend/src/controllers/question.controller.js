import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Question from "../models/question.model.js";
import Test from "../models/test.model.js";

// Add a question to a test
export const addQuestion = asyncHandler(async (req, res) => {
  const { testId, questionText, options, correctAnswer, type, marks = 1 } = req.body;

  if (!testId || !questionText || !correctAnswer || !type) {
    throw new ApiError(400, "Test ID, question text, correct answer, and type are required");
  }

  const test = await Test.findById(testId);
  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  if (test.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  const question = await Question.create({
    testId,
    questionText,
    options: options || [],
    correctAnswer,
    type,
    marks,
  });

  // Update test's total marks and questions array
  test.questions.push(question._id);
  test.totalMarks += marks;
  await test.save();

  return res.status(201).json(
    new ApiResponse(201, question, "Question added successfully")
  );
});

// Get all questions for a test
export const getQuestions = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  const test = await Test.findById(testId);
  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  // Check permissions
  if (req.user.role === 'Student' && !test.isActive) {
    throw new ApiError(403, "Test is not available");
  }

  if (req.user.role === 'Educator' && test.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  const questions = await Question.find({ testId });

  return res.status(200).json(
    new ApiResponse(200, questions, "Questions retrieved successfully")
  );
});

// Update a question
export const updateQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { questionText, options, correctAnswer, type, marks } = req.body;

  const question = await Question.findById(id).populate('testId');
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  if (question.testId.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  const oldMarks = question.marks;
  const updatedQuestion = await Question.findByIdAndUpdate(
    id,
    { questionText, options, correctAnswer, type, marks },
    { new: true }
  );

  // Update test's total marks if marks changed
  if (marks !== oldMarks) {
    const test = await Test.findById(question.testId);
    test.totalMarks = test.totalMarks - oldMarks + marks;
    await test.save();
  }

  return res.status(200).json(
    new ApiResponse(200, updatedQuestion, "Question updated successfully")
  );
});

// Delete a question
export const deleteQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const question = await Question.findById(id).populate('testId');
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  if (question.testId.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  // Update test's total marks and questions array
  const test = await Test.findById(question.testId);
  test.questions = test.questions.filter(q => q.toString() !== id);
  test.totalMarks -= question.marks;
  await test.save();

  await Question.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, {}, "Question deleted successfully")
  );
});