import React, { useState, useEffect } from "react";
import axios from "axios";
import EditConferenceModal from "../components/Organizer/EditConferenceModal";
import AssignReviewersModal from "../components/Organizer/AssignReviewersModal";
import ReviewDetailsModal from "../components/Organizer/ReviewDetailsModal"; // Import the new component
import "./OrganizerDashboard.css";

const OrganizerDashboard = () => {
    const [conferences, setConferences] = useState([]);
    const [selectedConference, setSelectedConference] = useState(null); // For edit modal
    const [selectedForReviewers, setSelectedForReviewers] = useState(null); // For reviewers modal
    const [selectedForReviewDetails, setSelectedForReviewDetails] = useState(null); // For review details modal

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/conferences`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setConferences(response.data);
            } catch (error) {
                console.error("Error fetching conferences:", error);
            }
        };

        fetchConferences();
    }, []);

    const handleEdit = (conference) => {
        setSelectedConference(conference); // Open modal with selected conference
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this conference?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(
                    `${process.env.REACT_APP_API_BASE_URL}/api/conferences/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setConferences(conferences.filter((conf) => conf._id !== id));
            } catch (error) {
                console.error("Error deleting conference:", error);
            }
        }
    };

    const handleAssignReviewers = (conference) => {
        setSelectedForReviewers(conference); // Open modal with the selected conference
    };

    const handleCloseSubmissions = async (id) => {
        if (window.confirm("Are you sure you want to close submissions for this conference?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.patch(
                    `${process.env.REACT_APP_API_BASE_URL}/api/conferences/${id}/close-submissions`, // Correct URL
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setConferences(
                    conferences.map((conf) =>
                        conf._id === id ? { ...conf, submissionClosed: true } : conf
                    )
                );
                alert("Submissions closed successfully!");
            } catch (error) {
                console.error("Error closing submissions:", error);
                alert("Failed to close submissions. Please try again.");
            }
        }
    };

    const handleSave = async (updatedConference) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/conferences`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setConferences(response.data); // Refetch and update the entire list
        } catch (error) {
            console.error("Error fetching conferences after saving:", error);
        }
    };
    

    const handleViewReviews = async (conference) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/conferences/${conference._id}/review-details`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            setSelectedForReviewDetails({
                ...response.data,
                date: response.data.date ? new Date(response.data.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }) : "No Date Provided",
            });            
        } catch (error) {
            console.error("Error fetching review details:", error);
        }
    };
    
    
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Organizer Dashboard</h1>
            <div className="dashboard-table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Reviewers</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conferences.map((conference) => (
                            <tr key={conference._id}>
                                <td>{conference.name}</td>
                                <td>
                                    {conference.date
                                        ? new Date(conference.date).toLocaleDateString("en-GB", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })
                                        : "No Date Provided"}
                                </td>
                                <td>{conference.description}</td>
                                <td>{conference.submissionClosed ? "Closed" : "Open"}</td>
                                <td>
                                    {conference.reviewers && conference.reviewers.length > 0
                                        ? conference.reviewers.map((reviewer) => reviewer.email).join(", ")
                                        : "None"}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="dashboard-button"
                                            onClick={() => handleEdit(conference)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="dashboard-button"
                                            onClick={() => handleDelete(conference._id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="dashboard-button"
                                            onClick={() => handleAssignReviewers(conference)}
                                        >
                                            Assign Reviewers
                                        </button>
                                        <button
                                            className="dashboard-button"
                                            onClick={() => handleViewReviews(conference)}
                                        >
                                            View Reviews
                                        </button>
                                        <button
                                            className="dashboard-button"
                                            onClick={() => handleCloseSubmissions(conference._id)}
                                            disabled={conference.submissionClosed}
                                        >
                                            {conference.submissionClosed
                                                ? "Closed"
                                                : "Close Submissions"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedConference && (
                <EditConferenceModal
                    conference={selectedConference}
                    onClose={() => setSelectedConference(null)}
                    onSave={handleSave}
                />
            )}
            {selectedForReviewers && (
                <AssignReviewersModal
                    conferenceId={selectedForReviewers._id} // Pass only the conference ID
                    onClose={() => setSelectedForReviewers(null)} // Close the modal
                    onSuccess={(updatedConference) => {
                        setConferences(
                            conferences.map((conf) =>
                                conf._id === updatedConference._id
                                    ? { ...conf, reviewers: updatedConference.reviewers }
                                    : conf
                            )
                        );
                        setSelectedForReviewers(null);
                    }}
                />
            )}
            {selectedForReviewDetails && (
                <ReviewDetailsModal
                    details={selectedForReviewDetails} // Ensure this is properly passed
                    onClose={() => setSelectedForReviewDetails(null)}
                />
            )}
        </div>
    );
};

export default OrganizerDashboard;
