import React, { useState } from "react";
import axios from "axios";
import "./EditConferenceModal.css"; 

const EditConferenceModal = ({ conference, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: conference.name,
        date: conference.date,
        description: conference.description,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `${process.env.REACT_APP_API_BASE_URL}/api/conferences/${conference._id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSave(response.data);
            onClose(); 
        } catch (error) {
            console.error("Error updating conference:", error);
            alert("Failed to update conference.");
        }
    };    

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Edit Conference</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Conference Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={new Date(formData.date).toISOString().split("T")[0]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="modal-button">
                        Save Changes
                    </button>
                    <button type="button" className="modal-button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditConferenceModal;
