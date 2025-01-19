import React from "react";
import "./RegisterForConferenceModal.css";

const RegisterForConferenceModal = ({ conference, onRegister, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Register for {conference.name}</h2>
                <p>
                    <strong>Date:</strong> {new Date(conference.date).toLocaleDateString()}
                </p>
                <p>
                    <strong>Description:</strong> {conference.description}
                </p>
                <div className="modal-actions">
                    <button className="modal-button" onClick={onRegister}>
                        Register
                    </button>
                    <button className="modal-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterForConferenceModal;
