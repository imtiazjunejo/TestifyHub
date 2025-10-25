import { Router } from "express";
import {
  submitTest,
  getUserResults,
  getTestResults,
  getResult,
  getAnalytics,
} from "../controllers/result.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(protectedRoute);

router.post("/submit", submitTest);
router.get("/user", getUserResults);
router.get("/test/:testId", getTestResults);
router.get("/:id", getResult);
router.get("/analytics", getAnalytics);

export default router;