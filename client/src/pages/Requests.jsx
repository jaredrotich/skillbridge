import React, { useEffect, useState } from "react";
import './Requests.css';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [editing, setEditing] = useState({});

  useEffect(() => {
    // Fetch skill requests
    const fetchSkillRequests = fetch("http://localhost:5000/requests/", {
      credentials: "include",
    }).then((r) => r.json());

    // Fetch client requests
    const fetchClientRequests = fetch("http://localhost:5000/requests/client", {
      credentials: "include",
    }).then((r) => r.json());

    Promise.all([fetchSkillRequests, fetchClientRequests])
      .then(([skills, clients]) => {
        // Add type label to each
        const skillWithType = skills.map((r) => ({ ...r, type: "skill" }));
        const clientWithType = clients.map((r) => ({ ...r, type: "client" }));
        const combined = [...skillWithType, ...clientWithType];

        setRequests(combined);

        // Initialize editing state
        const initial = {};
        combined.forEach((req) => {
          initial[req.id] = {
            status: req.status,
            feedback: req.feedback || "",
          };
        });
        setEditing(initial);
      });
  }, []);

  const handleFieldChange = (id, field, value) => {
    setEditing((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (req) => {
    const data = editing[req.id];
    if (!data) return;

    const endpoint =
      req.type === "client"
        ? `http://localhost:5000/requests/requests/${req.id}` 
        : `http://localhost:5000/requests/${req.id}`;

    fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to update");
        return r.json();
      })
      .then((updated) => {
        setRequests((prev) =>
          prev.map((r) => (r.id === updated.id ? { ...updated, type: req.type } : r))
        );
        alert("Changes saved ✔️");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to submit changes ❌");
      });
  };

  return (
    <div className="requests-container">
      <h2 className="requests-heading">All Requests</h2>

      {requests.length === 0 ? (
        <p className="no-requests">No requests available.</p>
      ) : (
        requests.map((r) => {
          const edit = editing[r.id];
          return (
            <div className="request-card" key={`${r.type}-${r.id}`}>
              <p>
                <strong>Type:</strong>{" "}
                <span style={{ color: r.type === "client" ? "purple" : "teal" }}>
                  {r.type === "client" ? "Client Request" : "Skill Request"}
                </span>
              </p>

              {r.type === "skill" ? (
                <>
                  <p><strong>Skill:</strong> {r.skill?.title}</p>
                  <p><strong>From:</strong> {r.requester?.username}</p>
                </>
              ) : (
                <>
                  <p><strong>From:</strong> {r.name} ({r.email})</p>
                </>
              )}

              <p><strong>Message:</strong> {r.message}</p>

              <label><strong>Status:</strong></label>
              <select
                value={edit?.status || "pending"}
                onChange={(e) =>
                  handleFieldChange(r.id, "status", e.target.value)
                }
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <label><strong>Feedback:</strong></label>
              <textarea
                rows="3"
                placeholder="Leave feedback..."
                value={edit?.feedback || ""}
                onChange={(e) =>
                  handleFieldChange(r.id, "feedback", e.target.value)
                }
              />

              <button
                onClick={() => handleSubmit(r)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.4rem 1rem",
                  background: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Submit Changes
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Requests;
