import React from "react";
import "./ReviewDetailsModal.css";

const ReviewDetailsModal = ({ details, onClose }) => {
    if (!details) return null;

    if (!details) return null; // Safeguard in case details are undefined

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Review Details</h2>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className="modal-content">
                    <h3>Conference: {details.name}</h3>
                    <p>
                        <strong>Date:</strong>{" "}
                        {details.date
                            ? (() => {
                                const [day, month, year] = details.date.split("/");
                                const parsedDate = new Date(`${year}-${month}-${day}`);
                                return !isNaN(parsedDate.getTime())
                                    ? parsedDate.toLocaleDateString("en-GB", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })
                                    : "Invalid Date";
                            })()
                            : "No Date Provided"}
                    </p>
                    <p>
                        <strong>Description:</strong> {details.description || "No Description"}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        {details.submissionClosed ? "Closed" : "Open"}
                    </p>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Reviewer Email</th>
                                    <th>Submission Count</th>
                                    <th>Pending Reviews</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.reviewers && details.reviewers.length > 0 ? (
                                    details.reviewers.map((reviewer, index) => (
                                        <tr key={index}>
                                            <td>{reviewer.email}</td>
                                            <td>{reviewer.submissionCount || 0}</td>
                                            <td>{reviewer.pendingReviews || 0}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">No reviewers assigned.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewDetailsModal;
