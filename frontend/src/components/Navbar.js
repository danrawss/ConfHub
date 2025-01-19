import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Existing CSS file

const Navbar = ({ userRole, setUserRole }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the local storage and reset role
        localStorage.removeItem("token");
        localStorage.removeItem("userRole"); // Clear saved role
        setUserRole(""); // Reset role state
        navigate("/"); // Redirect to the main page
    };

    return (
        <nav className="navbar">
            {/* Logo Section */}
            <div className="navbar-logo">
                <Link to="/">ConfHub</Link>
            </div>

            {/* Navigation Links */}
            <div className="navbar-links">
                {!userRole ? (
                    // Show Login/Signup links if no user is logged in
                    <>
                        <Link to="/login" className="navbar-button">
                            Login
                        </Link>
                        <Link to="/register" className="navbar-button">
                            Register
                        </Link>
                    </>
                ) : (
                    // Role-specific links
                    <>
                        {userRole === "organizer" && (
                            <>
                                <Link to="/organizer" className="navbar-button">
                                    Dashboard
                                </Link>
                                <Link
                                    to="/organizer/create-conference"
                                    className="navbar-button"
                                >
                                    Create Conference
                                </Link>
                            </>
                        )}
                        {userRole === "author" && (
                            <Link to="/author" className="navbar-button">
                                Dashboard
                            </Link>
                        )}
                        {userRole === "reviewer" && (
                            <Link to="/reviewer" className="navbar-button">
                                Dashboard
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="navbar-button logout-button"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
