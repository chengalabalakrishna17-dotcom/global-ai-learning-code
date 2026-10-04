const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads folder automatically
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Video storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const name =
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2, 8) +
      extension;

    cb(null, name);
  }
});

// Allow video files
const upload = multer({
  storage: storage,

  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed."));
    }
  },

  limits: {
    fileSize: 500 * 1024 * 1024
  }
});

// Serve uploaded videos
app.use("/uploads", express.static(uploadDir));

// Serve website
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "GLOBAL AI LEARNING server is working."
  });
});

// Video upload API
app.post("/api/upload-video", upload.single("video"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No video uploaded."
      });
    }

    const videoUrl =
      `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: "Video uploaded successfully.",
      video: {
        name: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        url: videoUrl
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Home page
app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "public", "index.html");

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <h1>GLOBAL AI LEARNING</h1>
      <p>Server is working.</p>
      <p>index.html was not found in the public folder.</p>
    `);
  }
});

// Error handler
app.use((err, req, res, next) => {
  res.status(400).json({
    success: false,
    error: err.message
  });
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found."
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`GLOBAL AI LEARNING server running on port ${PORT}`);
});
