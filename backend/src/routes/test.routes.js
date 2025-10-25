import { Router } from "express";
import {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
} from "../controllers/test.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(protectedRoute);

router.post("/", createTest);
router.get("/", getTests);
router.get("/:id", getTestById);
router.put("/:id", updateTest);
router.delete("/:id", deleteTest);

export default router;