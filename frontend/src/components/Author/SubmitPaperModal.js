import React, { useState } from "react";
import "./SubmitPaperModal.css";

const SubmitPaperModal = ({ conference, onSubmit, onClose }) => {
    const [paperTitle, setPaperTitle] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = () => {
        if (!paperTitle || !file) {
            setMessage("Please provide a paper title and upload a file.");
            return;
        }
        onSubmit({ title: paperTitle, file });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Submit a Paper for {conference.name}</h2>
                {message && <div className="message error">{message}</div>}
                <div className="form-group">
                    <label>Paper Title</label>
                    <input
                        type="text"
                        value={paperTitle}
                        onChange={(e) => setPaperTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Upload Paper</label>
                    <input type="file" onChange={handleFileChange} required />
                </div>
                <div className="modal-actions">
                    <button className="modal-button" onClick={handleSubmit}>
                        Submit
                    </button>
                    <button className="modal-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitPaperModal;
