const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  redirectToOriginal,
} = require("../controllers/urlController");

// Create short URL
router.post("/shorten", createShortUrl);

// Redirect
router.get("/:code", redirectToOriginal);

module.exports = router;
