const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password. Please try again." });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful.",
            token,
            user: { id: user._id, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Register Route
router.post("/register", async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{12,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be at least 12 characters long, include at least one number, and one special character.",
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

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

// Fetch all reviewers
router.get("/reviewers", verifyToken, async (req, res) => {
    try {
        const reviewers = await User.find({ role: "reviewer" }, "email"); // Fetch only emails
        res.status(200).json(reviewers);
    } catch (error) {
        console.error("Error fetching reviewers:", error);
        res.status(500).json({ message: "Failed to fetch reviewers." });
    }
});


module.exports = router;
