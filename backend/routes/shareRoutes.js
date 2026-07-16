import express from "express";
import { getBlogPreview } from "../controllers/blogController.js";

const router = express.Router();

router.get("/blog/:id", getBlogPreview);

export default router;
