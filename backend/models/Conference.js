const mongoose = require("mongoose");

const ConferenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    organizer: { type: String, required: true }, // Replace with ObjectId if referencing a User model
});

module.exports = mongoose.model("Conference", ConferenceSchema);
