import React from "react";

const ReviewerDashboard = () => {
    return (
        <div style={{ padding: "2rem" }}>
            <h2>Reviewer Dashboard</h2>
            <p>Welcome, Reviewer! Here you can view assigned papers and submit feedback.</p>
            <ul>
                <li><a href="/assigned-papers">View Assigned Papers</a></li>
                <li><a href="/submit-feedback">Submit Feedback</a></li>
            </ul>
        </div>
    );
};

export default ReviewerDashboard;
