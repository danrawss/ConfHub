import React, { useState } from "react";
import "./SubmitPaperModal.css";

const SubmitPaperModal = ({ conference, onSubmit, onClose }) => {
    const [paperTitle, setPaperTitle] = useState("");
    const [abstract, setAbstract] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!paperTitle || !file) {
            alert("Please provide a paper title and upload a file.");
            return;
        }

        setLoading(true); // Disable the button while submitting
        try {
            await onSubmit({ title: paperTitle, file }); 
            onClose(); // Close modal on successful submission
        } catch (error) {
            alert(error.message || "Failed to submit the paper.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Submit a Paper for {conference.name}</h2>
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
                    <label>Abstract</label>
                    <textarea
                        value={abstract}
                        onChange={(e) => setAbstract(e.target.value)}
                        required
                    />
                </div>;
                <div className="form-group">
                    <label>Upload Paper</label>
                    <input type="file" onChange={handleFileChange} required />
                </div>
                <div className="modal-actions">
                    <button className="modal-button" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                    <button className="modal-button" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitPaperModal;
