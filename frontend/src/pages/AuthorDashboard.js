import React, { useState, useEffect } from "react";
import axios from "axios";
import RegisterForConferenceModal from "../components/Author/RegisterForConferenceModal";
import SubmitPaperModal from "../components/Author/SubmitPaperModal";
import "./AuthorDashboard.css";

const AuthorDashboard = () => {
    const [conferences, setConferences] = useState([]);
    const [registeredConferences, setRegisteredConferences] = useState([]);
    const [selectedConference, setSelectedConference] = useState(null); // For registration modal
    const [selectedForSubmission, setSelectedForSubmission] = useState(null); // For submission modal

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

        const fetchRegisteredConferences = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/authors/registered-conferences`, // Correct endpoint
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setRegisteredConferences(response.data);
            } catch (error) {
                console.error("Error fetching registered conferences:", error);
            }
        };
        

        fetchConferences();
        fetchRegisteredConferences();
    }, []);

    const handleRegister = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/authors/${selectedConference._id}/register`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Successfully registered for the conference!");
            setSelectedConference(null);
            fetchRegisteredConferences(); // Refresh the registered conferences list
        } catch (error) {
            console.error("Error registering for the conference:", error.response || error.message);
            alert("Failed to register. Please try again.");
        }
    };

    const handleSubmitPaper = async ({ title, file }) => {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("file", file);

            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/authors/submit-paper/${selectedForSubmission._id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );
            alert("Paper submitted successfully!");
            setSelectedForSubmission(null);
        } catch (error) {
            console.error("Error submitting paper:", error);
            alert("Failed to submit the paper. Please try again.");
        }
    };

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
                                        >
                                            Register
                                        </button>
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
                                        >
                                            Submit Paper
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
