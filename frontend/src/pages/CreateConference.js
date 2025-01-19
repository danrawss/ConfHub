import React, { useState } from "react";
import axios from "axios";
import "./CreateConference.css";

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

            setMessage({ text: "Conference created successfully!", type: "success" }); // Success message
            setFormData({ name: "", date: "", description: "" });
        } catch (error) {
            console.error("Error creating conference:", error);
            setMessage({
                text: "Failed to create conference. Please try again.",
                type: "error",
            }); // Error message
        }

        // Clear the message after a delay
        setTimeout(() => {
            setMessage("");
        }, 3000); // Adjust the delay as needed
    };

    return (
        <div className="create-conference-container">
            <h2>Create Conference</h2>
            {message && (
                <p
                    className={`create-conference-message ${
                        message.type === "success" ? "success" : "error"
                    }`}
                >
                    {message.text}
                </p>
            )}
            <form className="create-conference-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Conference Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="date">Conference Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Conference Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className="create-conference-submit-button" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateConference;
