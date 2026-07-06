import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Readable } from "stream";
import { cloudinary } from "../config/cloudinary.js";

const router = express.Router();

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadBufferToCloudinary = (buffer, resourceType = "image") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "miliki", resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });

const uploadToCloudinaryOrLocal = async (file, resourceType = "image") => {
  const hasCloudinaryConfig = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

  if (hasCloudinaryConfig && file?.buffer?.length) {
    const result = await uploadBufferToCloudinary(file.buffer, resourceType);
    return { url: result.secure_url, filename: result.public_id };
  }

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, file.buffer);

  return { url: `/uploads/${filename}`, filename };
};

// POST /api/uploads/image
router.post("/image", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const result = await uploadToCloudinaryOrLocal(req.file, "image");
    res.json(result);
  } catch (error) {
    console.error("Image upload failed", error);
    res.status(500).json({ message: "Image upload failed" });
  }
});

// POST /api/uploads/file
router.post("/file", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const result = await uploadToCloudinaryOrLocal(req.file, "auto");
    res.json(result);
  } catch (error) {
    console.error("File upload failed", error);
    res.status(500).json({ message: "File upload failed" });
  }
});

export default router;
