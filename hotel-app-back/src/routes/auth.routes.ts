import { Router } from "express";
import { login, logout, profile, refreshToken, register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get('/user-profile', authMiddleware, profile);

export default router;