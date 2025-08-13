import express from "express";
import { authController } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", authController.loginUser);
router.get("/auth/me", authMiddleware, authController.getMe);
router.patch("/auth/change-password", authMiddleware, authController.changePassword);

export default router;
