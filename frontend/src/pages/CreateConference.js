import React, { useState } from "react";
import axios from "axios";

const CreateConference = () => {
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
            const token = localStorage.getItem("token"); // Get the token from local storage
            const organizerEmail = localStorage.getItem("email"); // Assume email is stored in local storage

            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/conferences`,
                { ...formData, organizer: organizerEmail }, // Include organizer email
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("Conference created successfully!");
            setFormData({ name: "", date: "", description: "" });
        } catch (error) {
            console.error("Error creating conference:", error);
            setMessage("Failed to create conference.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Create Conference</h2>
            {message && <p>{message}</p>}
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
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateConference;
