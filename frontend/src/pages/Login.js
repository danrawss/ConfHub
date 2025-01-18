import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = ({ setUserRole }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formData;

        if (!email || !password) {
            setMessage({ type: "error", text: "Please fill out all fields." });
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
                { email, password }
            );

            const { token, user } = response.data;

            // Save the token to localStorage
            localStorage.setItem("token", token);

            // Set the user role and navigate to the respective dashboard
            setUserRole(user.role);
            navigate(`/${user.role}`);
        } catch (error) {
            const errorMsg =
                error.response?.data?.message || "An error occurred during login.";
            setMessage({ type: "error", text: errorMsg });
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
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
                </div>
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
            <p style={{ marginTop: "1rem", textAlign: "center", color: "#555" }}>
                Don't have an account?{" "}
                <a
                    href="/register"
                    style={{ color: "#007BFF", textDecoration: "none" }}
                >
                    Register here
                </a>
            </p>
        </div>
    );
};

export default Login;
