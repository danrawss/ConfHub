const express = require("express");
const Paper = require("../models/Paper");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

// Fetch all papers assigned to the reviewer
router.get("/papers", verifyToken, async (req, res) => {
    const reviewerId = req.user.id;

    try {
        const papers = await Paper.find({ 
            reviewers: reviewerId,
            status: { $nin: ["Accepted", "Rejected"] }
        })
            .populate("author", "email") // Include author details
            .populate("conference", "name date"); // Include conference details

        res.status(200).json(papers);
    } catch (error) {
        console.error("Error fetching papers for reviewer:", error);
        res.status(500).json({ message: "Failed to fetch papers." });
    }
});

// Submit feedback for a paper
router.post("/papers/:id/feedback", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { feedback, status } = req.body; 
    const reviewerId = req.user.id;

    if (!feedback || !status) {
        return res.status(400).json({ message: "Feedback and status are required." });
    }

    if (!["Accepted", "Rejected", "Feedback"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value." });
    }

    try {
        const paper = await Paper.findById(id);
        if (!paper) {
            return res.status(404).json({ message: "Paper not found." });
        }

        if (!paper.reviewers.includes(reviewerId)) {
            return res.status(403).json({ message: "You are not assigned to review this paper." });
        }

        paper.feedback = feedback;
        paper.status = status; 
        await paper.save();

        res.status(200).json({ message: "Feedback submitted successfully.", paper });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ message: "Failed to submit feedback." });
    }
});

module.exports = router;
