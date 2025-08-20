import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { blogController } from "../controllers/blog.controller.js";

const router = express.Router();

router.post("/blog",authMiddleware,blogController.createBlog);
router.get("/blog", blogController.getAllBlogs);
router.get("/blog/:id", blogController.getSingleBlog);
router.put("/blog/:id", authMiddleware, blogController.updateBlog);
router.delete("/blog/:id", authMiddleware, blogController.deleteBlog);


export default router;
