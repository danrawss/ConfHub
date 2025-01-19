import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AssignReviewersModal.css";

const AssignReviewersModal = ({ conferenceId, onClose, onSuccess }) => {
    const [reviewers, setReviewers] = useState([]);
    const [selectedReviewers, setSelectedReviewers] = useState([]);
    const [message, setMessage] = useState(""); // To display errors or success messages

    useEffect(() => {
        const fetchReviewers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/auth/reviewers`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.length === 0) {
                    setMessage("No reviewers are available. Please register reviewers first.");
                }
                setReviewers(response.data);
            } catch (error) {
                console.error("Error fetching reviewers:", error);
                setMessage("Failed to fetch reviewers. Please try again later.");
            }
        };        

        fetchReviewers();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedReviewers((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((reviewerId) => reviewerId !== id)
                : [...prevSelected, id]
        );
    };

    const handleAssign = async () => {
        if (selectedReviewers.length === 0) {
            setMessage("Please select at least one reviewer.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/conferences/${conferenceId}/reviewers`,
                { reviewerIds: selectedReviewers },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Reviewers assigned successfully!");
            onSuccess(response.data); // Notify parent component
        } catch (error) {
            console.error("Error assigning reviewers:", error);
            setMessage("Failed to assign reviewers. Please try again.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Assign Reviewers</h2>
                {message && <div className="message">{message}</div>}
                {reviewers.length > 0 ? (
                    <ul>
                        {reviewers.map((reviewer) => (
                            <li key={reviewer._id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={reviewer._id}
                                        onChange={() => handleCheckboxChange(reviewer._id)}
                                    />
                                    {reviewer.email}
                                </label>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reviewers available. Please register reviewers first.</p>
                )}
                <div className="modal-actions">
                    <button className="modal-button" onClick={handleAssign}>
                        Assign
                    </button>
                    <button className="modal-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignReviewersModal;
