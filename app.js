const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/clickTracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the click counts
const ClickCountSchema = new mongoose.Schema({
  createCount: { type: Number, default: 0 },
  designCount: { type: Number, default: 0 },
});

// Create a model from the schema
const ClickCount = mongoose.model("ClickCount", ClickCountSchema);

// Middleware to parse JSON
app.use(express.json());

// Initialize or update the click count
app.post("/trackClick", async (req, res) => {
  const { type } = req.body;

  console.log("typeee", type);

  if (type !== "create" && type !== "design") {
    return res.status(400).send("Invalid click type");
  }

  try {
    // Find the click count document or create it if it doesn't exist
    const clickCount = await ClickCount.findOneAndUpdate(
      {},
      type === "create"
        ? { $inc: { createCount: 1 } }
        : { $inc: { designCount: 1 } },
      { upsert: true, new: true }
    );

    res.status(200).json(clickCount);
  } catch (error) {
    res.status(500).send("Error tracking click");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Click tracker API listening at http://localhost:${port}`);
});
