import React, { useState } from "react";
import "./ViewSubmissions.css";

const ViewSubmissions = ({ papers, onUploadRevision }) => {
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [newFile, setNewFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileChange = (e) => {
        setNewFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!newFile) {
            setErrorMessage("Please upload a new file.");
            return;
        }

        onUploadRevision(selectedPaper._id, newFile);
        setSelectedPaper(null); // Close the modal
        setNewFile(null); // Reset the file input
        setErrorMessage(""); 
    };

    return (
        <div className="submissions-container">
            <h2>Your Submitted Papers</h2>
            {papers.length > 0 ? (
                <table className="submissions-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Feedback</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {papers.map((paper) => (
                            <tr key={paper._id}>
                                <td>{paper.title}</td>
                                <td>{paper.status}</td>
                                <td>{paper.feedback || "No feedback yet"}</td>
                                <td>
                                    {paper.status === "Feedback" && (
                                        <button
                                            className="dashboard-button"
                                            onClick={() => setSelectedPaper(paper)}
                                        >
                                            Upload Revision
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>You have not submitted any papers yet.</p>
            )}

            {/* Modal for Uploading a New Version */}
            {selectedPaper && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h2>Upload Revision for {selectedPaper.title}</h2>
                        {errorMessage && <div className="message error">{errorMessage}</div>}
                        <div className="form-group">
                            <label>Upload New Version</label>
                            <input type="file" onChange={handleFileChange} />
                        </div>
                        <div className="modal-actions">
                            <button className="modal-button" onClick={handleUpload}>
                                Submit
                            </button>
                            <button
                                className="modal-button"
                                onClick={() => setSelectedPaper(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewSubmissions;
