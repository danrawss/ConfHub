const express = require("express");
const Conference = require("../models/Conference");
const verifyToken = require("../middleware/verifyToken");
const mongoose = require("mongoose");
const router = express.Router();

// Create a new conference
router.post("/", verifyToken, async (req, res) => {
    const { name, date, description } = req.body;
    const organizer = req.user.email; // Extract organizer email from token

    if (!name || !date || !description) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newConference = new Conference({ name, date, description, organizer });
        await newConference.save();
        res.status(201).json(newConference);
    } catch (error) {
        console.error("Error creating conference:", error);
        res.status(500).json({ message: "Failed to create conference." });
    }
});

// Fetch conferences for the logged-in organizer
router.get("/", verifyToken, async (req, res) => {
    const organizer = req.user.email;

    try {
        const conferences = await Conference.find({ organizer }).populate("reviewers", "email");
        res.status(200).json(conferences);
    } catch (error) {
        console.error("Error fetching conferences:", error);
        res.status(500).json({ message: "Failed to fetch conferences." });
    }
});

// Fetch available (open) conferences
router.get("/available", verifyToken, async (req, res) => {
    try {
        // Find conferences where submissions are still open
        const availableConferences = await Conference.find({ submissionClosed: { $ne: true } });
        res.status(200).json(availableConferences);
    } catch (error) {
        console.error("Error fetching available conferences:", error);
        res.status(500).json({ message: "Failed to fetch available conferences." });
    }
});

// Update a conference
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedConference = await Conference.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(updatedConference);
    } catch (error) {
        console.error("Error updating conference:", error);
        res.status(500).json({ message: "Failed to update conference." });
    }
});

// Delete a conference
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await Conference.findByIdAndDelete(id);
        res.status(200).json({ message: "Conference deleted successfully." });
    } catch (error) {
        console.error("Error deleting conference:", error);
        res.status(500).json({ message: "Failed to delete conference." });
    }
});

// Assign reviewers to a conference
router.post("/:id/reviewers", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewerIds } = req.body;

        if (!reviewerIds || reviewerIds.length === 0) {
            return res.status(400).json({ message: "No reviewers provided for assignment." });
        }

        // Validate reviewer IDs
        if (!reviewerIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: "Invalid reviewer IDs provided." });
        }

        const updatedConference = await Conference.findByIdAndUpdate(
            id,
            { $push: { reviewers: { $each: reviewerIds } } },
            { new: true }
        ).populate("reviewers", "email");

        if (!updatedConference) {
            return res.status(404).json({ message: "Conference not found." });
        }

        res.status(200).json(updatedConference);
    } catch (error) {
        console.error("Error assigning reviewers:", error);
        res.status(500).json({ message: "Failed to assign reviewers." });
    }
});

router.patch("/:id/close-submissions", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedConference = await Conference.findByIdAndUpdate(
            id,
            { $set: { submissionClosed: true } },
            { new: true }
        );
        res.status(200).json(updatedConference);
    } catch (error) {
        console.error("Error closing submissions:", error);
        res.status(500).json({ message: "Failed to close submissions.", error });
    }
});

router.get("/:id/review-details", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const conference = await Conference.findById(id).populate("reviewers", "email");

        if (!conference) {
            return res.status(404).json({ message: "Conference not found." });
        }

        res.status(200).json({
            name: conference.name,
            date: conference.date ? conference.date.toISOString() : null, // Ensure proper date format
            description: conference.description,
            reviewers: conference.reviewers, // Include reviewer details
            status: conference.submissionClosed ? "Closed" : "Open",
        });
    } catch (error) {
        console.error("Error fetching review details:", error);
        res.status(500).json({ message: "Failed to fetch review details.", error });
    }
});


module.exports = router;
