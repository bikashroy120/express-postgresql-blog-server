import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { blogLikeController } from "../controllers/blogLike.Controller.js";


const router = express.Router();

router.post("/blog/like",authMiddleware,blogLikeController.createBlogLike);

export default router;
