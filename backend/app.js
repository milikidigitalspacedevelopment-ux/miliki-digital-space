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
import storyRoutes from "./routes/storyRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

const rawCorsOrigins = process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "http://localhost:5173";
const allowedCorsOrigins = rawCorsOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedCorsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    }
  },
};

app.use(helmet());
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
app.use("/api/content", contentRoutes);
app.use("/api/categories", categoryRoutes);

// Uploads
app.use("/api/uploads", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
