import React, { useEffect, useState } from "react";
import axios from "axios";

const OrganizerDashboard = ({ organizerEmail }) => {
    const [conferences, setConferences] = useState([]);

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/conferences`,
                    { params: { organizer: organizerEmail } }
                );
                setConferences(response.data);
            } catch (error) {
                console.error("Error fetching conferences:", error);
            }
        };

        fetchConferences();
    }, [organizerEmail]);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Organizer Dashboard</h2>
            {conferences.length > 0 ? (
                <ul>
                    {conferences.map((conference) => (
                        <li key={conference._id} style={{ marginBottom: "1rem" }}>
                            <h3>{conference.name}</h3>
                            <p>{conference.description}</p>
                            <p>Date: {new Date(conference.date).toDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No conferences created yet. Click "Create Conference" to add one!</p>
            )}
        </div>
    );
};

export default OrganizerDashboard;
