const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password. Please try again." });
        }

        // Generate token
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role, // Include role in the token payload
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role, // Return the role to the frontend
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});

// Register endpoint
router.post("/register", async (req, res) => {
    const { email, password, role } = req.body;

    // Input validation
    if (!email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{12,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                "Password must be at least 12 characters long, include at least one number, and one special character.",
        });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the user
        const newUser = new User({
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});


module.exports = router;
