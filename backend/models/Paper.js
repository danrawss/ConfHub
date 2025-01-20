const mongoose = require("mongoose");

const PaperSchema = new mongoose.Schema({
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    fileUrl: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conference: { type: mongoose.Schema.Types.ObjectId, ref: "Conference", required: true },
    status: { type: String, enum: ["Pending", "Feedback", "Accepted", "Rejected"], default: "Pending" },
    feedback: { type: String }, 
    reviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Paper", PaperSchema);

