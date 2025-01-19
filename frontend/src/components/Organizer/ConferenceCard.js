import React, { useState } from "react";
import EditConferenceModal from "./EditConferenceModal";
import AssignReviewersModal from "./AssignReviewersModal";
import axios from "axios";

const ConferenceCard = ({ conference, setConferences }) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAssignModalOpen, setAssignModalOpen] = useState(false);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${process.env.REACT_APP_API_BASE_URL}/api/conferences/${conference._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setConferences((prev) => prev.filter((c) => c._id !== conference._id));
        } catch (error) {
            console.error("Error deleting conference:", error);
        }
    };

    return (
        <div>
            <h3>{conference.name}</h3>
            <p>{conference.date}</p>
            <p>{conference.description}</p>
            <button onClick={() => setEditModalOpen(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={() => setAssignModalOpen(true)}>Assign Reviewers</button>

            {isEditModalOpen && (
                <EditConferenceModal
                    conference={conference}
                    onClose={() => setEditModalOpen(false)}
                    setConferences={setConferences}
                />
            )}
            {isAssignModalOpen && (
                <AssignReviewersModal
                    conferenceId={conference._id}
                    onClose={() => setAssignModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ConferenceCard;
