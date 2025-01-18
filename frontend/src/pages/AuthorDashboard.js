import React from "react";

const AuthorDashboard = () => {
    return (
        <div style={{ padding: "2rem" }}>
            <h2>Author Dashboard</h2>
            <p>Welcome, Author! Here you can submit papers and track your submissions.</p>
            <ul>
                <li><a href="/submit-paper">Submit a New Paper</a></li>
                <li><a href="/my-papers">View My Papers</a></li>
            </ul>
        </div>
    );
};

export default AuthorDashboard;
