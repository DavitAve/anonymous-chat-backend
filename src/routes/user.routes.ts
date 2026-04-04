import { Router } from "express";
import { deleteAccount } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.delete("/me", authMiddleware, deleteAccount);

export default router;
