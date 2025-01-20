const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["organizer", "author", "reviewer"], required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
