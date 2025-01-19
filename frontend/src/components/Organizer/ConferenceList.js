import React from "react";
import ConferenceCard from "./ConferenceCard";

const ConferenceList = ({ conferences, setConferences }) => {
    return (
        <div>
            {conferences.map((conference) => (
                <ConferenceCard
                    key={conference._id}
                    conference={conference}
                    setConferences={setConferences}
                />
            ))}
        </div>
    );
};

export default ConferenceList;
