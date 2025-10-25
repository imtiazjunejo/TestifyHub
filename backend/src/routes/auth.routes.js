
import { Router } from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/user.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", signupUser);
router.post("/login", loginUser);
router.get("/user", protectedRoute, getUser);
router.post("/logout", protectedRoute, logoutUser);

export default router;
