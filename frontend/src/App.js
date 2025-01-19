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
                        <div style={{ padding: "2rem", textAlign: "center" }}>
                            <h1>Welcome to ConfHub!</h1>
                            <p>Your one-stop solution for managing and participating in conferences.</p>
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
