import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RequestSkill({ user }) {
  const { id: skill_id } = useParams(); 
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [localUser, setLocalUser] = useState(user || null); // fallback if user not passed

  // Fetch user if not passed as prop
  useEffect(() => {
    if (!localUser) {
      fetch("http://localhost:5000/users/check_session", {
        credentials: "include",
      })
        .then((r) => {
          if (r.ok) return r.json();
          else throw new Error("Unauthorized");
        })
        .then((data) => setLocalUser(data))
        .catch(() => navigate("/login")); // redirect to login if session invalid
    }
  }, [localUser, navigate]);

  const handleRequest = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    if (!localUser) {
      setError("You must be logged in to request a skill.");
      return;
    }

    fetch("http://localhost:5000/requests/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        requester_id: localUser.id,
        skill_id: skill_id,
        message,
      }),
    })
      .then((r) => {
        if (r.ok) return r.json();
        return r.json().then((data) => {
          throw new Error(data.error || "Request failed");
        });
      })
      .then(() => {
        alert("Skill request sent successfully!");
        navigate("/requests");
      })
      .catch((err) => {
        console.error("Request error:", err);
        setError(err.message || "Could not send request. Please try again.");
      });
  };

  return (
    <div className="container" style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Request This Skill</h2>
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      <form onSubmit={handleRequest}>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          placeholder="Write a short message for the skill owner..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send Request
        </button>
      </form>
    </div>
  );
}

export default RequestSkill;
