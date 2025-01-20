import React, { useState, useEffect } from "react";
import axios from "axios";
import useRoleValidation from "../hooks/useRoleValidation";
import "./Dashboard.css"
import "./ReviewerDashboard.css";

const ReviewerDashboard = () => {
    const [papers, setPapers] = useState([]);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    useRoleValidation("reviewer");

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/reviewers/papers`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPapers(response.data);
            } catch (error) {
                console.error("Error fetching papers:", error);
            }
        };

        fetchPapers();
    }, []);

    const handleSubmitFeedback = async () => {
        if (!feedback || !status) {
            alert("Please provide feedback and select a status.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/reviewers/papers/${selectedPaper._id}/feedback`,
                { feedback, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Feedback submitted successfully!");
            setSelectedPaper(null);
            setFeedback("");
            setStatus("");
            const updatedPapers = papers.map((paper) =>
                paper._id === selectedPaper._id ? { ...paper, feedback, status } : paper
            );
            setPapers(updatedPapers);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Reviewer Dashboard</h1>
            <div className="dashboard-table-container">
                <h2>Assigned Papers</h2>
                {papers.length > 0 ? (
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Conference</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {papers.map((paper) => (
                                <tr key={paper._id}>
                                    <td>{paper.title}</td>
                                    <td>{paper.author?.email || "N/A"}</td>
                                    <td>{paper.conference?.name || "N/A"}</td>
                                    <td>{paper.status}</td>
                                    <td>
                                        <button
                                            className="dashboard-button"
                                            onClick={() => setSelectedPaper(paper)}
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No papers assigned for review.</p>
                )}
            </div>

            {selectedPaper && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h2>Review Paper: {selectedPaper.title}</h2>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter your feedback here..."
                        ></textarea>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Select Status</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Feedback">Needs Revision</option>
                        </select>
                        <button
                            className="dashboard-button"
                            onClick={handleSubmitFeedback}
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Feedback"}
                        </button>
                        <button
                            className="dashboard-button cancel"
                            onClick={() => setSelectedPaper(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewerDashboard;
