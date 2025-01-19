const mongoose = require("mongoose");

const ConferenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    organizer: { type: String, required: true },
    reviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of reviewers
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of registered authors
    submissionClosed: { type: Boolean, default: false }, // Whether submissions are closed
});

module.exports = mongoose.model("Conference", ConferenceSchema);
