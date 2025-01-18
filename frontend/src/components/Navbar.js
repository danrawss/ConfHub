import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Keep the existing CSS file

const Navbar = ({ userRole, setUserRole }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUserRole(""); // Reset role on logout
        navigate("/"); // Redirect to main page
    };

    return (
        <nav className="navbar">
            {/* Logo Section */}
            <div className="navbar-logo">
                <Link to="/">ConfHub</Link>
            </div>

            {/* Links Section */}
            <div className="navbar-links">
                {userRole === "" ? (
                    // Redirect Login Button to /login
                    <button
                        onClick={() => navigate("/login")}
                        className="navbar-button"
                    >
                        Login
                    </button>
                ) : (
                    <>
                        {userRole === "organizer" && (
                            <>
                                <Link
                                    to="/organizer"
                                    className="navbar-button"
                                >
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
                        <button onClick={handleLogout} className="navbar-button">
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
