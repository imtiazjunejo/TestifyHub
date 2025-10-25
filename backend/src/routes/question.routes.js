import { Router } from "express";
import {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} from "../controllers/question.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(protectedRoute);

router.post("/", addQuestion);
router.get("/:testId", getQuestions);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

export default router;