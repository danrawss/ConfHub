import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AuthorDashboard from "./pages/AuthorDashboard";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import CreateConference from "./pages/CreateConference";

const App = () => {
    const [userRole, setUserRole] = useState(""); // Track logged-in user's role

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

                {/* Login Page */}
                <Route path="/login" element={<Login setUserRole={setUserRole} />} />
                <Route path="/register" element={<Register />} />

                {/* Role-Specific Routes */}
                <Route
                    path="/organizer"
                    element={userRole === "organizer" ? <OrganizerDashboard organizerEmail="organizer@example.com" /> : <Navigate to="/" />}
                />
                <Route
                    path="/organizer/create-conference"
                    element={userRole === "organizer" ? <CreateConference organizerEmail="organizer@example.com" /> : <Navigate to="/" />}
                />
                <Route path="/author" element={userRole === "author" ? <AuthorDashboard /> : <Navigate to="/" />} />
                <Route path="/reviewer" element={userRole === "reviewer" ? <ReviewerDashboard /> : <Navigate to="/" />} />

                {/* Redirect Unauthenticated Users */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
