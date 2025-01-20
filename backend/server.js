const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const conferenceRoutes = require("./routes/conferences"); 
const authRoutes = require("./routes/auth");
const authorRoutes = require("./routes/author");
const reviewerRoutes = require("./routes/reviewer");

dotenv.config(); 

const app = express();

// Allow CORS for your frontend origin
app.use(cors({ origin: "http://localhost:3000" }));

// Middleware
app.use(express.json()); 

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ConfHub";
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/conferences", conferenceRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/reviewers", reviewerRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
