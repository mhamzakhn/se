import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import config from "./config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve images locally in development
app.use(
  "/images",
  express.static(path.join(__dirname, "..", "public", "images"))
);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
