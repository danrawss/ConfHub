import React, { useState, useEffect } from "react";
import axios from "axios";
import useRoleValidation from "../hooks/useRoleValidation";
import RegisterForConferenceModal from "../components/Author/RegisterForConferenceModal";
import SubmitPaperModal from "../components/Author/SubmitPaperModal";
import ViewSubmissions from "../components/Author/ViewSubmissions";
import "./Dashboard.css"
import "./AuthorDashboard.css";

const AuthorDashboard = () => {
    const [conferences, setConferences] = useState([]);
    const [registeredConferences, setRegisteredConferences] = useState([]);
    const [submittedPapers, setSubmittedPapers] = useState([]);
    const [selectedConference, setSelectedConference] = useState(null); 
    const [selectedForSubmission, setSelectedForSubmission] = useState(null); 
    const [loading, setLoading] = useState(false);
    useRoleValidation("author");

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/conferences/available`,
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
        fetchRegisteredConferences();
        fetchSubmittedPapers();
    }, []);

    const fetchRegisteredConferences = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/authors/registered-conferences`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRegisteredConferences(response.data);
        } catch (error) {
            console.error("Error fetching registered conferences:", error.response || error.message);
        }
    };

    const fetchSubmittedPapers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/authors/papers/submissions`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubmittedPapers(response.data);
        } catch (error) {
            console.error("Error fetching submitted papers:", error.response || error.message);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/authors/${selectedConference._id}/register`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Successfully registered for the conference!");
            setSelectedConference(null);
            await fetchRegisteredConferences(); 
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to register. Please try again.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitPaper = async ({ title, abstract, file }) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("abstract", abstract); 
            formData.append("fileUrl", file); 
    
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/authors/${selectedForSubmission._id}/papers`,
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );
    
            alert("Paper submitted successfully!");
            setSelectedForSubmission(null);
            await fetchSubmittedPapers(); 
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to submit the paper.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };    

    const handleUploadRevision = async (paperId, file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("fileUrl", file);

            const token = localStorage.getItem("token");
            await axios.put(
                `${process.env.REACT_APP_API_BASE_URL}/api/authors/papers/${paperId}/revision`,
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );

            alert("Revision uploaded successfully!");
            // Refresh the papers list to reflect the updated status
            setSubmittedPapers((prev) =>
                prev.map((paper) =>
                    paper._id === paperId
                        ? { ...paper, status: "Pending Review", feedback: "" }
                        : paper
                )
            );
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to upload the revision.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Author Dashboard</h1>

            <div className="dashboard-table-container">
                <h2>Available Conferences</h2>
                {conferences.length > 0 ? (
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conferences.map((conference) => (
                                <tr key={conference._id}>
                                    <td>{conference.name}</td>
                                    <td>{new Date(conference.date).toLocaleDateString()}</td>
                                    <td>{conference.description}</td>
                                    <td>
                                        <button
                                            className="dashboard-button"
                                            onClick={() => setSelectedConference(conference)}
                                            disabled={!conference.reviewers || conference.reviewers.length < 2 || loading}
                                        >
                                            {loading ? "Loading..." : "Register"}
                                        </button>
                                        {(!conference.reviewers || conference.reviewers.length < 2) && (
                                            <small style={{ color: "red", marginLeft: "8px" }}>
                                                At least 2 reviewers required
                                            </small>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No available conferences at the moment. Please check back later.</p>
                )}
            </div>

            <div className="dashboard-table-container">
                <h2>Registered Conferences</h2>
                {registeredConferences.length > 0 ? (
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registeredConferences.map((conference) => (
                                <tr key={conference._id}>
                                    <td>{conference.name}</td>
                                    <td>{new Date(conference.date).toLocaleDateString()}</td>
                                    <td>{conference.description}</td>
                                    <td>
                                        <button
                                            className="dashboard-button"
                                            onClick={() => setSelectedForSubmission(conference)}
                                            disabled={loading}
                                        >
                                            {loading ? "Loading..." : "Submit Paper"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>You have not registered for any conferences yet.</p>
                )}
            </div>

            <div className="dashboard-table-container">
                <h2>Your Submitted Papers</h2>
                <ViewSubmissions papers={submittedPapers} onUploadRevision={handleUploadRevision} />
            </div>

            {selectedConference && (
                <RegisterForConferenceModal
                    conference={selectedConference}
                    onRegister={handleRegister}
                    onClose={() => setSelectedConference(null)}
                />
            )}

            {selectedForSubmission && (
                <SubmitPaperModal
                    conference={selectedForSubmission}
                    onSubmit={handleSubmitPaper}
                    onClose={() => setSelectedForSubmission(null)}
                />
            )}
        </div>
    );
};

export default AuthorDashboard;
