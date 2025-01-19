const express = require("express");
const Conference = require("../models/Conference");
const Paper = require("../models/Paper");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

// Register for a conference
router.post("/:id/register", verifyToken, async (req, res) => {
    const { id } = req.params;
    const author = req.user.id;

    try {
        const conference = await Conference.findById(id);
        if (!conference) {
            return res.status(404).json({ message: "Conference not found." });
        }

        if (conference.participants && conference.participants.includes(author)) {
            return res.status(400).json({ message: "Already registered for this conference." });
        }

        conference.participants = conference.participants || [];
        conference.participants.push(author);
        await conference.save();

        res.status(200).json({ message: "Registered for the conference successfully." });
    } catch (error) {
        console.error("Error registering for the conference:", error);
        res.status(500).json({ message: "Failed to register for the conference." });
    }
});


// Fetch registered conferences
router.get("/registered-conferences", verifyToken, async (req, res) => {
    const author = req.user.id;

    try {
        const conferences = await Conference.find({ participants: author });
        res.status(200).json(conferences);
    } catch (error) {
        console.error("Error fetching registered conferences:", error);
        res.status(500).json({ message: "Failed to fetch registered conferences." });
    }
});


// Submit a paper
router.post("/:id/papers", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { title, abstract, fileUrl } = req.body;
    const author = req.user.id;

    if (!title || !abstract || !fileUrl) {
        return res.status(400).json({ message: "Title, abstract, and file URL are required." });
    }

    try {
        const conference = await Conference.findById(id);
        if (!conference) {
            return res.status(404).json({ message: "Conference not found." });
        }

        if (!conference.participants.includes(author)) {
            return res.status(403).json({ message: "Must register for the conference before submitting a paper." });
        }

        const paper = new Paper({
            title,
            abstract,
            fileUrl,
            author,
            conference: id,
        });

        const reviewers = conference.reviewers.slice(0, 2);
        paper.reviewers = reviewers;

        await paper.save();
        res.status(201).json({ message: "Paper submitted successfully.", paper });
    } catch (error) {
        console.error("Error submitting paper:", error);
        res.status(500).json({ message: "Failed to submit paper." });
    }
});

// Update a paper
router.patch("/papers/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { fileUrl } = req.body;
    const author = req.user.id;

    if (!fileUrl) {
        return res.status(400).json({ message: "Updated file URL is required." });
    }

    try {
        const paper = await Paper.findById(id);
        if (!paper) {
            return res.status(404).json({ message: "Paper not found." });
        }

        if (paper.author.toString() !== author) {
            return res.status(403).json({ message: "Not authorized to update this paper." });
        }

        paper.fileUrl = fileUrl;
        paper.status = "Pending";
        await paper.save();

        res.status(200).json({ message: "Paper updated successfully.", paper });
    } catch (error) {
        console.error("Error updating paper:", error);
        res.status(500).json({ message: "Failed to update paper." });
    }
});

// View submissions
router.get("/papers/submissions", verifyToken, async (req, res) => {
    const author = req.user.id;

    try {
        const papers = await Paper.find({ author }).populate("conference", "name date");
        res.status(200).json(papers);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ message: "Failed to fetch submissions." });
    }
});

module.exports = router;
