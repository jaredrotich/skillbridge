import React, { useEffect, useState } from "react";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/requests/")
      .then((r) => r.json())
      .then(setRequests);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Skill Requests</h2>
      {requests.map((r) => (
        <div key={r.id} style={{ border: "1px solid gray", marginBottom: "1rem", padding: "1rem" }}>
          <p><strong>Skill:</strong> {r.skill.title}</p>
          <p><strong>From:</strong> {r.requester.username}</p>
          <p><strong>Message:</strong> {r.message}</p>
          <p><strong>Status:</strong> {r.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Requests;
