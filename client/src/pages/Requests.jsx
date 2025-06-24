import React, { useEffect, useState } from "react";
import './Requests.css';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [editing, setEditing] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/requests/", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        setRequests(data);
        // initialize editing state
        const initial = {};
        data.forEach((req) => {
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

  const handleSubmit = (id) => {
    const data = editing[id];
    if (!data) return;

    fetch(`http://localhost:5000/requests/${id}`, {
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
          prev.map((req) => (req.id === id ? updated : req))
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
      <h2 className="requests-heading">Skill Requests</h2>

      {requests.length === 0 ? (
        <p className="no-requests">No skill requests yet.</p>
      ) : (
        requests.map((r) => {
          const edit = editing[r.id];
          return (
            <div className="request-card" key={r.id}>
              <p><strong>Skill:</strong> {r.skill?.title}</p>
              <p><strong>From:</strong> {r.requester?.username}</p>
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
                onClick={() => handleSubmit(r.id)}
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
