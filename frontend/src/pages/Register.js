import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; 

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [passwordFeedback, setPasswordFeedback] = useState("");
    const navigate = useNavigate();

    const validatePassword = (password) => {
        if (password.length < 12) {
            return "Password must be at least 12 characters long.";
        }
        if (!/\d/.test(password)) {
            return "Password must contain at least one number.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return "Password must contain at least one special character.";
        }
        return "Password looks good!";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "password") {
            setPasswordFeedback(validatePassword(value));
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password, role } = formData;

        if (!email || !password || !role) {
            setMessage({ type: "error", text: "Please fill out all fields." });
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError !== "Password looks good!") {
            setMessage({ type: "error", text: passwordError });
            return;
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`,
                formData
            );

            setMessage({
                type: "success",
                text: "Registration successful! Redirecting to login...",
            });
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                "An error occurred during registration.";
            setMessage({ type: "error", text: errorMsg });
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Register</h1>
            {message.text && (
                <p className={`message ${message.type}`}>
                    {message.text}
                </p>
            )}
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-input"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-input"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {passwordFeedback && (
                        <p
                            style={{
                                color: passwordFeedback === "Password looks good!" ? "green" : "red",
                                marginTop: "0.5rem",
                                fontSize: "0.9rem",
                            }}
                        >
                            {passwordFeedback}
                        </p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="role">Select Your Role</label>
                    <select
                        id="role"
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="organizer">Organizer</option>
                        <option value="author">Author</option>
                        <option value="reviewer">Reviewer</option>
                    </select>
                </div>
                <button type="submit" className="login-button">
                    Register
                </button>
            </form>
            <p style={{ marginTop: "1rem", textAlign: "center", color: "#555" }}>
                Already have an account?{" "}
                <a
                    href="/login"
                    style={{ color: "#007BFF", textDecoration: "none" }}
                >
                    Login here
                </a>
            </p>
        </div>
    );
};

export default Register;
