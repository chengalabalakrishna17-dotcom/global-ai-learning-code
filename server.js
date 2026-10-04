const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Website files
app.use(express.static(path.join(__dirname, "public")));

// API test route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Astra GPT server is working!"
  });
});

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Unknown route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Astra GPT server running on port ${PORT}`);
});
