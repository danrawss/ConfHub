import React, { useEffect, useState } from "react";
import axios from "axios";

const ConferenceDashboard = () => {
    const [conferences, setConferences] = useState([]);

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/conferences`);
                setConferences(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchConferences();
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Conference Dashboard</h2>
            <ul>
                {conferences.map((conf) => (
                    <li key={conf._id}>
                        <h3>{conf.name}</h3>
                        <p>{conf.description}</p>
                        <p><strong>Date:</strong> {new Date(conf.date).toDateString()}</p>
                        <p><strong>Organizer:</strong> {conf.organizer.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConferenceDashboard;
