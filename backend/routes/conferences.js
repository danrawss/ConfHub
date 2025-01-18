const express = require("express");
const Conference = require("../models/Conference");
const router = express.Router();

// Create a new conference
router.post("/", async (req, res) => {
    const { name, date, description, organizer } = req.body;

    // Validate input
    if (!name || !date || !description || !organizer) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newConference = new Conference({ name, date, description, organizer });
        await newConference.save();
        res.status(201).json(newConference);
    } catch (error) {
        console.error("Error creating conference:", error);
        res.status(500).json({ message: "Error creating conference", error });
    }
});

// Fetch all conferences
router.get("/", async (req, res) => {
    try {
        const conferences = await Conference.find();
        res.json(conferences);
    } catch (error) {
        console.error("Error fetching conferences:", error);
        res.status(500).json({ message: "Error fetching conferences", error });
    }
});

// Fetch conferences by organizer
router.get("/:organizer", async (req, res) => {
    const { organizer } = req.params;

    if (!organizer) {
        return res.status(400).json({ message: "Organizer is required." });
    }

    try {
        const conferences = await Conference.find({ organizer });
        if (conferences.length === 0) {
            return res.status(404).json({ message: "No conferences found for this organizer." });
        }
        res.json(conferences);
    } catch (error) {
        console.error("Error fetching conferences by organizer:", error);
        res.status(500).json({ message: "Error fetching conferences", error });
    }
});

module.exports = router;
