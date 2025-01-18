import React, { useState } from "react";
import axios from "axios";

const CreateConference = ({ organizerEmail }) => {
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        description: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send the form data with the organizer's email
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/conferences`,
                { ...formData, organizer: organizerEmail }
            );
            setMessage("Conference created successfully!");
            setFormData({ name: "", date: "", description: "" }); // Clear the form
        } catch (error) {
            console.error("Error creating conference:", error);
            setMessage("Failed to create conference.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Create Conference</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Conference Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ marginLeft: "1rem", padding: "0.5rem" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Conference Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        style={{ marginLeft: "1rem", padding: "0.5rem" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Conference Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        style={{
                            marginLeft: "1rem",
                            padding: "0.5rem",
                            width: "100%",
                            height: "100px",
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Create Conference
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateConference;
