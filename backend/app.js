import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { json, urlencoded } from "express";
import path from "path";
import { fileURLToPath } from "url";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import communicationsRoutes from "./routes/communicationsRoutes.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

const defaultCorsOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const rawCorsOrigins = [process.env.CORS_ORIGINS, process.env.CORS_ORIGIN, process.env.FRONTEND_URL]
  .filter(Boolean)
  .join(",");

const allowedCorsOrigins = [...new Set([...defaultCorsOrigins, ...rawCorsOrigins.split(",").map((origin) => origin.trim()).filter(Boolean)])];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedCorsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(helmet());
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Miliki backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/communications", communicationsRoutes);

app.use("/api/shares", shareRoutes);

// Uploads
app.use("/api/uploads", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
