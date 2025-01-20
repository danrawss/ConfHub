import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AuthorDashboard from "./pages/AuthorDashboard";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import CreateConference from "./pages/CreateConference";

const App = () => {
    const [userRole, setUserRole] = useState(""); // Track logged-in user's role

    useEffect(() => {
        // Retrieve role from localStorage (if available) to persist the user's role after reload
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    const handleLogin = (role) => {
        setUserRole(role);
        localStorage.setItem("userRole", role); // Save role to localStorage
    };

    return (
        <Router>
            <Navbar userRole={userRole} setUserRole={setUserRole} />
            <Routes>
                {/* Main Page */}
                <Route
                    path="/"
                    element={
                        <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
                            <div style={{ marginBottom: "4rem" }}>
                                <h1 style={{ fontSize: "2.5rem", color: "#333", marginBottom: "2rem" }}>
                                    Welcome to ConfHub!
                                </h1>
                                <p style={{ fontSize: "1.2rem", color: "#555", maxWidth: "600px", margin: "0 auto" }}>
                                    Your one-stop solution for managing and participating in conferences.
                                    Submit papers, review submissions, and organize events effortlessly!
                                </p>
                            </div>

                            <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", marginBottom: "4rem" }}>
                                <div
                                    style={{
                                        backgroundColor: "#f9f9f9",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: "2rem",
                                        maxWidth: "300px",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        textAlign: "center",
                                    }}
                                >
                                    <h3 style={{ fontSize: "1.5rem", color: "#333", marginBottom: "1rem" }}>
                                        Organizers
                                    </h3>
                                    <p style={{ color: "#666", fontSize: "1rem", marginBottom: "1rem" }}>
                                        Manage conferences, assign reviewers, and track submissions.
                                    </p>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: "#f9f9f9",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: "2rem",
                                        maxWidth: "300px",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        textAlign: "center",
                                    }}
                                >
                                    <h3 style={{ fontSize: "1.5rem", color: "#333", marginBottom: "1rem" }}>
                                        Authors
                                    </h3>
                                    <p style={{ color: "#666", fontSize: "1rem", marginBottom: "1rem" }}>
                                        Submit your papers and track their review progress.
                                    </p>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: "#f9f9f9",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: "2rem",
                                        maxWidth: "300px",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        textAlign: "center",
                                    }}
                                >
                                    <h3 style={{ fontSize: "1.5rem", color: "#333", marginBottom: "1rem" }}>
                                        Reviewers
                                    </h3>
                                    <p style={{ color: "#666", fontSize: "1rem", marginBottom: "1rem" }}>
                                        Review assigned papers and provide valuable feedback.
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                />

                {/* Login and Register Pages */}
                <Route path="/login" element={<Login setUserRole={handleLogin} />} />
                <Route path="/register" element={<Register />} />

                {/* Organizer Routes */}
                <Route
                    path="/organizer"
                    element={
                        <ProtectedRoute role={userRole} requiredRole="organizer">
                            <OrganizerDashboard organizerEmail="organizer@example.com" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/organizer/create-conference"
                    element={
                        <ProtectedRoute role={userRole} requiredRole="organizer">
                            <CreateConference organizerEmail="organizer@example.com" />
                        </ProtectedRoute>
                    }
                />

                {/* Author Routes */}
                <Route
                    path="/author"
                    element={
                        <ProtectedRoute role={userRole} requiredRole="author">
                            <AuthorDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Reviewer Routes */}
                <Route
                    path="/reviewer"
                    element={
                        <ProtectedRoute role={userRole} requiredRole="reviewer">
                            <ReviewerDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Redirect Unauthenticated Users */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
