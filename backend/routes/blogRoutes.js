import express from "express";
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  trackBlogView,
  trackBlogShare,
  trackBlogTimeSpent,
} from "../controllers/blogController.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlog);
router.post("/:id/track-view", trackBlogView);
router.post("/:id/track-share", trackBlogShare);
router.post("/:id/track-time", trackBlogTimeSpent);
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
