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

  const handleUpdate = (id, status, feedback) => {
    fetch(`http://localhost:5000/requests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status, feedback }),
    })
      .then((r) => r.json())
      .then((updated) => {
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? updated : req))
        );
      });
  };

  return (
    <div className="requests-container">
      <h2 className="requests-heading">Skill Requests</h2>

      {requests.length === 0 ? (
        <p className="no-requests">No skill requests yet.</p>
      ) : (
        requests.map((r) => (
          <div className="request-card" key={r.id}>
            <p><strong>Skill:</strong> {r.skill?.title}</p>
            <p><strong>From:</strong> {r.requester?.username}</p>
            <p><strong>Message:</strong> {r.message}</p>

            <label><strong>Status:</strong></label>
            <select
              value={r.status}
              onChange={(e) => handleUpdate(r.id, e.target.value, r.feedback || "")}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <label><strong>Feedback:</strong></label>
            <textarea
              rows="3"
              value={r.feedback || ""}
              onChange={(e) => handleUpdate(r.id, r.status, e.target.value)}
              placeholder="Leave feedback..."
            />

          </div>
        ))
      )}
    </div>
  );
}

export default Requests;
