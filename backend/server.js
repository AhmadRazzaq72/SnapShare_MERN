import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import cron from "node-cron";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const ShareSchema = new mongoose.Schema({
  id: String,
  type: String, // "text" or "file"
  content: String,
  filePath: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});
const Share = mongoose.model("Share", ShareSchema);

const upload = multer({ dest: "uploads/" });

// Upload text
app.post("/upload/text", async (req, res) => {
  const { text } = req.body;
  const id = nanoid(6);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
  await Share.create({ id, type: "text", content: text, expiresAt });
  res.json({ link: `${process.env.BASE_URL}/get/${id}` });
});

// Upload file
app.post("/upload/file", upload.single("file"), async (req, res) => {
  const id = nanoid(6);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await Share.create({ id, type: "file", filePath: req.file.path, expiresAt });
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
    res.download(data.filePath);
  }
});

// Cron cleanup
cron.schedule("*/10 * * * *", async () => {
  const now = new Date();
  const expired = await Share.find({ expiresAt: { $lt: now } });
  expired.forEach(item => {
    if (item.filePath) fs.unlink(item.filePath, () => {});
  });
  await Share.deleteMany({ expiresAt: { $lt: now } });
  console.log("🧹 Cleaned expired shares");
});

app.listen(5000, () => console.log("🚀 Backend running on port 5000"));
