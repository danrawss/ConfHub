import React from "react";
import "./ReviewDetailsModal.css";

const ReviewDetailsModal = ({ details, onClose }) => {
    if (!details) return null;

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
                        <strong>Date:</strong> {details.date || "No Date Provided"}
                    </p>
                    <p>
                        <strong>Description:</strong> {details.description || "No Description"}
                    </p>
                    <p>
                        <strong>Status:</strong> {details.status}
                    </p>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Paper Title</th>
                                    <th>Status</th>
                                    <th>File</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.papers && details.papers.length > 0 ? (
                                    details.papers.map((paper, index) => (
                                        <tr key={index}>
                                            <td>{paper.title}</td>
                                            <td>{paper.status}</td>
                                            <td>
                                                {paper.status === "Accepted" ? (
                                                    <a
                                                        href={`${process.env.REACT_APP_API_BASE_URL}/${paper.fileUrl}`} // Correct backend API URL
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View File
                                                    </a>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">No papers submitted yet.</td>
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
