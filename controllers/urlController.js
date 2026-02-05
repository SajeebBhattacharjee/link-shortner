const Url = require("../models/url");
const shortid = require("shortid");
const validUrl = require("valid-url");

// POST: Create short URL
exports.createShortUrl = async (req, res) => {
  const { originalUrl } = req.body;
  const baseUrl = process.env.BASE_URL;

  // Validate original URL
  if (!validUrl.isUri(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    // Check if URL already exists
    let url = await Url.findOne({ originalUrl });

    if (url) {
      return res.json({
        shortUrl: `${baseUrl}/${url.shortCode}`,
      });
    }

    // Generate short code
    const shortCode = shortid.generate();

    // Save to DB
    url = new Url({
      originalUrl,
      shortCode,
    });

    await url.save();

    res.status(201).json({
      shortUrl: `${baseUrl}/${shortCode}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET: Redirect to original URL
exports.redirectToOriginal = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
