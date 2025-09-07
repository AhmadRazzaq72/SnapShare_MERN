import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import cron from "node-cron";
import fs from "fs";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// -------------------
// DB Connection
// -------------------
mongoose.connect(process.env.MONGO_URI);

// -------------------
// Schema
// -------------------
const ShareSchema = new mongoose.Schema({
  id: String,
  type: String, // "text" or "file"
  content: String,
  filePath: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});
const Share = mongoose.model("Share", ShareSchema);

// -------------------
// Rate Limiting
// -------------------
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests/min
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// -------------------
// File Upload Setup
// -------------------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${nanoid(8)}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// -------------------
// Routes
// -------------------

// Upload text
app.post("/upload/text", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const id = nanoid(6);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
  await Share.create({ id, type: "text", content: text, expiresAt });

  res.json({ link: `${process.env.BASE_URL}/get/${id}` });
});

// Upload file
app.post("/upload/file", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "File is required" });

  const id = nanoid(6);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await Share.create({
    id,
    type: "file",
    filePath: req.file.path,
    expiresAt,
  });

  res.json({ link: `${process.env.BASE_URL}/get/${id}` });
});

// Get content
app.get("/get/:id", async (req, res) => {
  const data = await Share.findOne({ id: req.params.id });

  if (!data || data.expiresAt < new Date()) {
    return res.status(404).json({ error: "Not found or expired" });
  }

  if (data.type === "text") {
    res.json({ type: "text", content: data.content });
  } else {
    // return file url instead of forcing download
    res.json({
      type: "file",
      url: `${process.env.BASE_URL}/${data.filePath}`,
    });
  }
});

// -------------------
// Serve Uploaded Files
// -------------------
app.use("/uploads", express.static("uploads"));

// -------------------
// Cron cleanup
// -------------------
cron.schedule("*/10 * * * *", async () => {
  const now = new Date();
  const expired = await Share.find({ expiresAt: { $lt: now } });

  expired.forEach((item) => {
    if (item.filePath && fs.existsSync(item.filePath)) {
      fs.unlink(item.filePath, (err) => {
        if (err) console.error("❌ File deletion error:", err);
      });
    }
  });

  await Share.deleteMany({ expiresAt: { $lt: now } });
  console.log("🧹 Cleaned expired shares");
});

// -------------------
// Start Server
// -------------------
app.listen(5000, () =>
  console.log("🚀 Backend running on http://localhost:5000")
);
