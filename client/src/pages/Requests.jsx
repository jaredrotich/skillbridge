import React, { useEffect, useState } from "react";
import './Requests.css';


function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/requests/", {
      credentials: "include", 
    })
      .then((r) => r.json())
      .then(setRequests);
  }, []);

  return (
    <div className="requests-container">
      <h2 className="requests-heading">Skill Requests</h2>

      {requests.length === 0 ? (
        <p className="no-requests">No skill requests yet.</p>
      ) : (
        requests.map((r) => (
          <div className="request-card" key={r.id}>
            <p><strong>Skill:</strong> {r.skill ? r.skill.title : "Unknown Skill"}</p>
            <p><strong>From:</strong> {r.requester ? r.requester.username : "Unknown User"}</p>
            <p><strong>Message:</strong> {r.message}</p>
            <p><strong>Status:</strong> {r.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Requests;
